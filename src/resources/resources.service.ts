import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository } from 'typeorm';
import { FindAvailabilityDto } from './dto/find-availability.dto';
import { ResourcesEntity } from './entity/resources.entity';
import { BookingsEntity } from 'src/bookings/entity/bookings.entity';
import { Status, TypeResource } from 'src/common/enums/resource.enums';
import { BookingRulesService } from 'src/booking-rules/booking-rules.service';
import { BookingRulesEntity } from 'src/booking-rules/entity/booking-rules.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourcesEntity)
    private readonly resourceRepository: Repository<ResourcesEntity>,
    @InjectRepository(BookingsEntity)
    private readonly bookingRepository: Repository<BookingsEntity>,
    private readonly bookingRulesService: BookingRulesService,
  ) {}

  async findAvailable(findAvailabilityDto: FindAvailabilityDto) {
    const { startDate, endDate, type, status, orderBy, order } =
      findAvailabilityDto;

    // 1. Encontrar todos los ID de recursos que tienen reservas que se solapan con el rango de fechas.
    const overlappingBookings = this.bookingRepository
      .createQueryBuilder('booking')
      .select('booking.resource_id')
      .where(
        new Brackets((qb) => {
          qb.where('booking.start_date < :endDate', { endDate }).andWhere(
            'booking.end_date > :startDate',
            { startDate },
          );
        }),
      )
      .andWhere('booking.status != :status', { status: 'cancelled' });

    const bookedResourceIds = (await overlappingBookings.getRawMany()).map(
      (b) => b.booking_resource_id,
    );

    // 2. Construir la consulta principal para los recursos.
    const query = this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.room', 'room')
      .leftJoinAndSelect('resource.vehicle', 'vehicle')
      .leftJoinAndSelect('resource.equipment', 'equipment')
      .where('resource.status != :retiredStatus', {
        retiredStatus: Status.retired,
      });

    // 3. Excluir los recursos que ya están reservados.
    if (bookedResourceIds.length > 0) {
      query.andWhere('resource.id NOT IN (:...bookedResourceIds)', {
        bookedResourceIds,
      });
    }

    // 4. Aplicar filtros opcionales.
    if (type) {
      query.andWhere('resource.type = :type', { type });
    }

    if (status) {
      const specificStatus = status as Status;
      query.andWhere(
        '(room.status = :status OR vehicle.status = :status OR equipment.status = :status)',
        { status: specificStatus },
      );
    }
    
    // 5. Aplicar ordenamiento.
    if (orderBy) {
      const orderColumn = this.getOrderByColumn(orderBy, type);
      query.orderBy(orderColumn, order);
    }

    const availableResources = await query.getMany();

    if (!availableResources.length) {
      throw new NotFoundException(
        'No se encontraron recursos disponibles para los criterios seleccionados.',
      );
    }

    // 6. Aplicar reglas de negocio
    const compliantResources = [];
    for (const resource of availableResources) {
      const rule = await this.bookingRulesService.findApplicableRule(
        resource.id,
        resource.type,
      );
      if (this.isRuleCompliant(findAvailabilityDto, rule)) {
        compliantResources.push(resource);
      }
    }

    if (!compliantResources.length) {
      throw new NotFoundException(
        'No se encontraron recursos que cumplan con las reglas de negocio para los criterios seleccionados.',
      );
    }

    return compliantResources.map(this.mapResource);
  }

  private isRuleCompliant(
    bookingRequest: FindAvailabilityDto,
    rule: BookingRulesEntity | null,
  ): boolean {
    // Si no hay regla, se asume que es válido. O se puede definir una regla por defecto estricta.
    if (!rule) {
      return true;
    }

    const start = new Date(bookingRequest.startDate);
    const end = new Date(bookingRequest.endDate);
    const now = new Date();

    // Regla: Duración máxima
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    if (durationMinutes > rule.maxDuration) {
      return false;
    }

    // Regla: Anticipación mínima
    const anticipationMinutes = (start.getTime() - now.getTime()) / (1000 * 60);
    if (anticipationMinutes < rule.minAnticipation) {
      return false;
    }

    // Regla: Días bloqueados
    const bookingDay = start.getUTCDay(); // 0 = Domingo, 6 = Sábado
    if (rule.blockedDays?.includes(bookingDay)) {
      return false;
    }

    // Regla: Horas permitidas
    const requestedStartTime = `${start.getUTCHours()}:${start.getUTCMinutes()}`;
    const requestedEndTime = `${end.getUTCHours()}:${end.getUTCMinutes()}`;

    if (
      requestedStartTime < rule.allowedStartHour ||
      requestedEndTime > rule.allowedEndHour
    ) {
      return false;
    }

    // Nota: La regla 'maxActiveBookingsPerUser' es específica del usuario
    // y no puede ser validada en este contexto de búsqueda de disponibilidad general.
    // Debería validarse al momento de crear la reserva.

    return true;
  }

  async getBookingHistory(id: number) {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado.`);
    }

    return this.bookingRepository.find({
      where: { resource: { id } },
      relations: ['user'], // Opcional: para incluir info del usuario en la reserva
    });
  }

  private getOrderByColumn(orderBy: string, type?: TypeResource): string {
    const baseResourceColumns = ['id', 'type'];
    if (baseResourceColumns.includes(orderBy)) {
      return `resource.${orderBy}`;
    }

    const columnMap = {
      [TypeResource.room]: ['name', 'capacity', 'status'],
      [TypeResource.vehicle]: ['brand', 'model', 'plate', 'status'],
      [TypeResource.equipment]: ['name', 'serial_number', 'status'],
    };

    if (type && columnMap[type] && columnMap[type].includes(orderBy)) {
      return `${type.toLowerCase()}.${orderBy}`;
    }
    
    // Fallback o error si no se encuentra la columna
    return 'resource.id';
  }

  private mapResource(resource: ResourcesEntity) {
    const base = {
      id: resource.id,
      type: resource.type,
    };

    switch (resource.type) {
      case TypeResource.room:
        return { ...base, ...resource.room };
      case TypeResource.vehicle:
        return { ...base, ...resource.vehicle };
      case TypeResource.equipment:
        return { ...base, ...resource.equipment };
      default:
        return base;
    }
  }
}
