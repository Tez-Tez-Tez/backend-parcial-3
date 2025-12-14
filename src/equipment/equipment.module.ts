import { Module } from '@nestjs/common';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentEntity } from './entity/equipment.entity';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentEntity, ResourcesEntity])],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService]
})
export class EquipmentModule { }
