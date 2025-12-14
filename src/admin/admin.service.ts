import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsEntity, BookingStatus } from 'src/bookings/entity/bookings.entity';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';
import { TypeResource, Status } from 'src/common/enums/resource.enums';
import { RoomsEntity } from 'src/rooms/entity/rooms.entity';
import { VehiclesEntity } from 'src/vehicles/entity/vehicles.entity';
import { EquipmentEntity } from 'src/equipment/entity/equipment.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(BookingsEntity)
        private readonly bookingRepo: Repository<BookingsEntity>,
        @InjectRepository(ResourcesEntity)
        private readonly resourceRepo: Repository<ResourcesEntity>,
    ) { }

    async getResourcesStatus() {
        const resources = await this.resourceRepo.find();
        const now = new Date();

        const statusByType = {
            rooms: { available: 0, occupied: 0, maintenance: 0, retired: 0 },
            vehicles: { available: 0, occupied: 0, maintenance: 0, retired: 0 },
            equipment: { available: 0, occupied: 0, maintenance: 0, retired: 0 },
        };

        for (const resource of resources) {
            // Check if resource is currently booked
            const activeBooking = await this.bookingRepo.findOne({
                where: {
                    resourceId: resource.id,
                    resourceType: resource.type,
                    status: BookingStatus.CONFIRMED,
                    startDate: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour buffer
                    endDate: new Date(now.getTime() + 1000 * 60 * 60),
                },
            });

            let typeKey: 'rooms' | 'vehicles' | 'equipment';
            if (resource.type === TypeResource.room) typeKey = 'rooms';
            else if (resource.type === TypeResource.vehicle) typeKey = 'vehicles';
            else typeKey = 'equipment';

            // Get resource details to check status
            let resourceStatus = Status.available;
            if (resource.type === TypeResource.room) {
                const room = await this.resourceRepo.manager.getRepository(RoomsEntity).findOne({
                    where: { resource: { id: resource.id } },
                });
                if (room) resourceStatus = room.status;
            } else if (resource.type === TypeResource.vehicle) {
                const vehicle = await this.resourceRepo.manager.getRepository(VehiclesEntity).findOne({
                    where: { resource: { id: resource.id } },
                });
                if (vehicle) resourceStatus = vehicle.status;
            } else if (resource.type === TypeResource.equipment) {
                const equipment = await this.resourceRepo.manager.getRepository(EquipmentEntity).findOne({
                    where: { resource: { id: resource.id } },
                });
                if (equipment) resourceStatus = equipment.status;
            }

            if (resourceStatus === Status.maintenance) {
                statusByType[typeKey].maintenance++;
            } else if (resourceStatus === Status.retired) {
                statusByType[typeKey].retired++;
            } else if (activeBooking) {
                statusByType[typeKey].occupied++;
            } else {
                statusByType[typeKey].available++;
            }
        }

        return statusByType;
    }

    async getResourcesSnapshot() {
        const resources = await this.resourceRepo.find();
        const now = new Date();

        const snapshot = [];

        for (const resource of resources) {
            // Get current booking if any
            const currentBooking = await this.bookingRepo.findOne({
                where: {
                    resourceId: resource.id,
                    resourceType: resource.type,
                    status: BookingStatus.CONFIRMED,
                    startDate: new Date(now.getTime() - 1000 * 60 * 60),
                    endDate: new Date(now.getTime() + 1000 * 60 * 60),
                },
                relations: ['user'],
            });

            // Get resource details
            let resourceDetails: any = { id: resource.id, type: resource.type };

            if (resource.type === TypeResource.room) {
                const room = await this.resourceRepo.manager.getRepository(RoomsEntity).findOne({
                    where: { resource: { id: resource.id } },
                });
                if (room) resourceDetails = { ...resourceDetails, ...room };
            } else if (resource.type === TypeResource.vehicle) {
                const vehicle = await this.resourceRepo.manager.getRepository(VehiclesEntity).findOne({
                    where: { resource: { id: resource.id } },
                });
                if (vehicle) resourceDetails = { ...resourceDetails, ...vehicle };
            } else if (resource.type === TypeResource.equipment) {
                const equipment = await this.resourceRepo.manager.getRepository(EquipmentEntity).findOne({
                    where: { resource: { id: resource.id } },
                });
                if (equipment) resourceDetails = { ...resourceDetails, ...equipment };
            }

            snapshot.push({
                resource: resourceDetails,
                currentBooking: currentBooking ? {
                    id: currentBooking.id,
                    user: currentBooking.user?.mail,
                    startDate: currentBooking.startDate,
                    endDate: currentBooking.endDate,
                } : null,
            });
        }

        return snapshot;
    }

    async getBookingStats() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const [totalBookings, todayBookings, activeBookings, cancelledBookings] = await Promise.all([
            this.bookingRepo.count(),
            this.bookingRepo.count({
                where: {
                    createdAt: new Date(startOfDay.getTime()),
                },
            }),
            this.bookingRepo.count({
                where: {
                    status: BookingStatus.CONFIRMED,
                    endDate: new Date(now.getTime()),
                },
            }),
            this.bookingRepo.count({
                where: {
                    status: BookingStatus.CANCELLED,
                },
            }),
        ]);

        return {
            totalBookings,
            todayBookings,
            activeBookings,
            cancelledBookings,
        };
    }
}
