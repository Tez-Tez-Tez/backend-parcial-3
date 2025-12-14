import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesEntity } from './entity/vehicles.entity';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehiclesEntity, ResourcesEntity])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService]
})
export class VehiclesModule { }
