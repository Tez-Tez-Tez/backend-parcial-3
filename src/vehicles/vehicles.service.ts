import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehiclesEntity } from './entity/vehicles.entity';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicles.dto';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';
import { TypeResource } from 'src/common/enums/resource.enums';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectRepository(VehiclesEntity)
        private readonly vehicleRepo: Repository<VehiclesEntity>,
        @InjectRepository(ResourcesEntity)
        private readonly resourceRepo: Repository<ResourcesEntity>,
    ) { }

    async create(dto: CreateVehicleDto): Promise<VehiclesEntity> {
        // Create resource entry first
        const resource = this.resourceRepo.create({
            type: TypeResource.vehicle,
        });
        const savedResource = await this.resourceRepo.save(resource);

        // Create vehicle with reference to resource
        const vehicle = this.vehicleRepo.create({
            ...dto,
            resource: savedResource,
        });

        return this.vehicleRepo.save(vehicle);
    }

    async findAll(): Promise<VehiclesEntity[]> {
        return this.vehicleRepo.find({
            relations: ['resource'],
        });
    }

    async findOne(id: number): Promise<VehiclesEntity> {
        const vehicle = await this.vehicleRepo.findOne({
            where: { id },
            relations: ['resource'],
        });

        if (!vehicle) {
            throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
        }

        return vehicle;
    }

    async update(id: number, dto: UpdateVehicleDto): Promise<VehiclesEntity> {
        const vehicle = await this.vehicleRepo.preload({
            id,
            ...dto,
        });

        if (!vehicle) {
            throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
        }

        return this.vehicleRepo.save(vehicle);
    }

    async remove(id: number): Promise<void> {
        const vehicle = await this.findOne(id);
        await this.vehicleRepo.remove(vehicle);
    }
}
