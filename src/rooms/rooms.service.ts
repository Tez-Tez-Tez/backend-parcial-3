import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomsEntity } from './entity/rooms.entity';
import { CreateRoomDto, UpdateRoomDto } from './dto/rooms.dto';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';
import { TypeResource } from 'src/common/enums/resource.enums';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(RoomsEntity)
        private readonly roomRepo: Repository<RoomsEntity>,
        @InjectRepository(ResourcesEntity)
        private readonly resourceRepo: Repository<ResourcesEntity>,
    ) { }

    async create(dto: CreateRoomDto): Promise<RoomsEntity> {
        // Create resource entry first
        const resource = this.resourceRepo.create({
            type: TypeResource.room,
        });
        const savedResource = await this.resourceRepo.save(resource);

        // Create room with reference to resource
        const room = this.roomRepo.create({
            ...dto,
            resource: savedResource,
        });

        return this.roomRepo.save(room);
    }

    async findAll(): Promise<RoomsEntity[]> {
        return this.roomRepo.find({
            relations: ['resource'],
        });
    }

    async findOne(id: number): Promise<RoomsEntity> {
        const room = await this.roomRepo.findOne({
            where: { id },
            relations: ['resource'],
        });

        if (!room) {
            throw new NotFoundException(`Sala con ID ${id} no encontrada`);
        }

        return room;
    }

    async update(id: number, dto: UpdateRoomDto): Promise<RoomsEntity> {
        const room = await this.findOne(id);

        Object.assign(room, dto);

        return this.roomRepo.save(room);
    }

    async remove(id: number): Promise<void> {
        const room = await this.findOne(id);
        await this.roomRepo.remove(room);
    }
}
