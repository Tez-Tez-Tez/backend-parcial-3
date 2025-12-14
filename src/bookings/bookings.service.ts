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
import { RoomsEntity } from 'src/rooms/entity/rooms.entity';
import { VehiclesEntity } from 'src/vehicles/entity/vehicles.entity';
import { EquipmentEntity } from 'src/equipment/entity/equipment.entity';

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
    this.bookingsGateway.emitBookingCreated(saved);
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
    this.bookingsGateway.emitBookingCancelled(savedBooking);
    return savedBooking;
  }

  async findAvailableResources(start: Date, end: Date, type?: TypeResource): Promise<any[]> {
    // Build base query for resources
    let resourcesQuery = this.resourceRepo.createQueryBuilder('r');

    // Filter by type if specified
    if (type) {
      resourcesQuery = resourcesQuery.where('r.type = :type', { type });
    }

    const allResources = await resourcesQuery.getMany();

    // For each resource, check if it's available
    const availableResources = [];

    for (const resource of allResources) {
      // Check for conflicting bookings
      const conflict = await this.bookingRepo.findOne({
        where: {
          resourceId: resource.id,
          resourceType: resource.type,
          status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
          startDate: LessThan(end),
          endDate: MoreThan(start),
        },
      });

      if (!conflict) {
        // Get the specific resource details based on type
        let resourceDetails: any = { id: resource.id, type: resource.type };

        if (resource.type === TypeResource.room) {
          const room = await this.resourceRepo.manager.getRepository(RoomsEntity).findOne({
            where: { resource: { id: resource.id } },
          });
          if (room && room.status === Status.available) {
            resourceDetails = { ...resourceDetails, ...room };
          } else {
            continue; // Skip if not available
          }
        } else if (resource.type === TypeResource.vehicle) {
          const vehicle = await this.resourceRepo.manager.getRepository(VehiclesEntity).findOne({
            where: { resource: { id: resource.id } },
          });
          if (vehicle && vehicle.status === Status.available) {
            resourceDetails = { ...resourceDetails, ...vehicle };
          } else {
            continue;
          }
        } else if (resource.type === TypeResource.equipment) {
          const equipment = await this.resourceRepo.manager.getRepository(EquipmentEntity).findOne({
            where: { resource: { id: resource.id } },
          });
          if (equipment && equipment.status === Status.available) {
            resourceDetails = { ...resourceDetails, ...equipment };
          } else {
            continue;
          }
        }

        availableResources.push(resourceDetails);
      }
    }

    return availableResources;
  }

  async getUserHistory(userId: number): Promise<BookingsEntity[]> {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async getResourceHistory(resourceId: number, resourceType: TypeResource): Promise<BookingsEntity[]> {
    return this.bookingRepo.find({
      where: {
        resourceId,
        resourceType,
      },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}