import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesEntity } from './entity/resources.entity';
import { BookingsEntity } from 'src/bookings/entity/bookings.entity';
import { BookingRulesModule } from './booking-rules/booking-rules.module';
import { RoomsEntity } from 'src/rooms/entity/rooms.entity';
import { VehiclesEntity } from 'src/vehicles/entity/vehicles.entity';
import { EquipmentEntity } from 'src/equipment/entity/equipment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResourcesEntity,
      BookingsEntity,
      RoomsEntity,
      VehiclesEntity,
      EquipmentEntity,
    ]),
    BookingRulesModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule { }
