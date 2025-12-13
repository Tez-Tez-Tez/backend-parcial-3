import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingsEntity, BookingStatus } from './entity/bookings.entity';
import { In, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { CreateBookingDto, UpdateBookingDto } from './dto/bookings.dto';
import { UsersEntity } from 'src/users/entity/users.entity';
import { BookingRulesService } from 'src/booking-rules/booking-rules.service';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';
import { BookingsGateway } from './bookings.gateway';
import { Status, TypeResource } from 'src/common/enums/resource.enums';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingsEntity)
    private readonly bookingRepo: Repository<BookingsEntity>,
    @InjectRepository(ResourcesEntity)
    private readonly resourceRepo: Repository<ResourcesEntity>,
    private readonly rulesService: BookingRulesService,
    private readonly bookingsGateway: BookingsGateway,
  ) { }

  async create(user: UsersEntity, dto: CreateBookingDto): Promise<BookingsEntity> {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const now = new Date();

    if (end <= start) {
      throw new BadRequestException('La fecha final debe ser posterior a la inicial');
    }
    if (start <= now) {
      throw new BadRequestException('No se puede reservar en el pasado');
    }

    // 1. Validar reglas
    const rule = await this.rulesService.findApplicableRule(dto.resourceId, dto.resourceType);
    if (rule) {
      // Duración
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      if (durationMinutes > rule.maxDuration) {
        throw new BadRequestException(`Duración máxima permitida: ${rule.maxDuration} minutos`);
      }

      // Anticipación
      const minutesInAdvance = (start.getTime() - now.getTime()) / (1000 * 60);
      if (minutesInAdvance < rule.minAnticipation) {
        throw new BadRequestException(`Anticipación mínima requerida: ${rule.minAnticipation} minutos`);
      }

      // Horario
      const startTime = start.toTimeString().slice(0, 5); // HH:MM
      const endTime = end.toTimeString().slice(0, 5);
      if (startTime < rule.allowedStartHour || endTime > rule.allowedEndHour) {
        throw new BadRequestException(`Horario permitido: ${rule.allowedStartHour} - ${rule.allowedEndHour}`);
      }

      // Días bloqueados
      const dayOfWeek = start.getDay(); // 0=Sunday
      if (rule.blockedDays && rule.blockedDays.includes(dayOfWeek)) {
        throw new BadRequestException('El recurso no está disponible en este día de la semana');
      }

      // Límite por usuario
      const activeBookings = await this.bookingRepo.count({
        where: {
          user: { id: user.id },
          status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
          endDate: MoreThan(now)
        }
      });
      if (activeBookings >= rule.maxActiveBookingsPerUser) {
        throw new BadRequestException(`Has alcanzado el límite de ${rule.maxActiveBookingsPerUser} reservas activas`);
      }
    }

    // 2. Validar Solapamiento
    const conflict = await this.bookingRepo.findOne({
      where: {
        resourceId: dto.resourceId,
        resourceType: dto.resourceType,
        status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
        startDate: LessThan(end),
        endDate: MoreThan(start),
      },
    });

    if (conflict) {
      throw new BadRequestException('El recurso ya está reservado en ese horario');
    }

    // 3. Crear Reserva
    const booking = this.bookingRepo.create({
      ...dto,
      startDate: start,
      endDate: end,
      user,
      status: BookingStatus.PENDING,
    });

    const saved = await this.bookingRepo.save(booking);
    this.bookingsGateway.server.emit('booking.created', saved);
    return saved;
  }

  async update(
    bookingId: number,
    user: UsersEntity,
    dto: UpdateBookingDto,
  ): Promise<BookingsEntity> {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');

    if (booking.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('No tienes permiso para modificar esta reserva');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Solo se pueden modificar reservas pendientes');
    }

    if (dto.startDate) booking.startDate = new Date(dto.startDate);
    if (dto.endDate) booking.endDate = new Date(dto.endDate);
    if (dto.purpose) (booking as any).purpose = dto.purpose;

    return this.bookingRepo.save(booking);
  }

  async cancel(id: number, user: UsersEntity): Promise<BookingsEntity> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');

    if (booking.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('No tienes permiso para cancelar esta reserva');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    booking.status = BookingStatus.CANCELLED;
    const savedBooking = await this.bookingRepo.save(booking);
    this.bookingsGateway.server.emit('booking.cancelled', savedBooking);
    return savedBooking;
  }

  async findAvailableResources(start: Date, end: Date, type?: string): Promise<any[]> {
    // Subquery to find booked resource IDs in the range
    const bookedQuery = this.bookingRepo
      .createQueryBuilder('b')
      .select('b.resource_id')
      .where('b.status IN (:...statuses)', { statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED] })
      .andWhere('b.resourceType = r.type') // Correlate with outer query if needed, but easier to do exclusion
      .andWhere('b.start_date < :end', { end })
      .andWhere('b.end_date > :start', { start })
      .getQuery();

    // Main query: All resources NOT IN booked
    // Note: We need a way to select from ResourcesEntity. 
    // Since BookingsService injects BookingsEntity, we might need to inject ResourcesManager or Repository.
    // For now, I'll use the EntityManager or assume we can query ResourcesEntity.
    // Better approach: Inject ResourcesRepository.
    return []; // Placeholder until dependency injection is fixed
  }
}