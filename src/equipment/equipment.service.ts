import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentEntity } from './entity/equipment.entity';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/equipment.dto';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';
import { TypeResource } from 'src/common/enums/resource.enums';

@Injectable()
export class EquipmentService {
    constructor(
        @InjectRepository(EquipmentEntity)
        private readonly equipmentRepo: Repository<EquipmentEntity>,
        @InjectRepository(ResourcesEntity)
        private readonly resourceRepo: Repository<ResourcesEntity>,
    ) { }

    async create(dto: CreateEquipmentDto): Promise<EquipmentEntity> {
        // Create resource entry first
        const resource = this.resourceRepo.create({
            type: TypeResource.equipment,
        });
        const savedResource = await this.resourceRepo.save(resource);

        // Create equipment with reference to resource
        const equipment = this.equipmentRepo.create({
            ...dto,
            resource: savedResource,
        });

        return this.equipmentRepo.save(equipment);
    }

    async findAll(): Promise<EquipmentEntity[]> {
        return this.equipmentRepo.find({
            relations: ['resource'],
        });
    }

    async findOne(id: number): Promise<EquipmentEntity> {
        const equipment = await this.equipmentRepo.findOne({
            where: { id },
            relations: ['resource'],
        });

        if (!equipment) {
            throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
        }

        return equipment;
    }

    async update(id: number, dto: UpdateEquipmentDto): Promise<EquipmentEntity> {
        const equipment = await this.equipmentRepo.preload({
            id,
            ...dto,
        });

        if (!equipment) {
            throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
        }

        return this.equipmentRepo.save(equipment);
    }

    async remove(id: number): Promise<void> {
        const equipment = await this.findOne(id);
        await this.equipmentRepo.remove(equipment);
    }
}
