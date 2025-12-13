import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesEntity } from './entity/resources.entity';
import { RoomsEntity } from 'src/rooms/entity/rooms.entity';
import { VehiclesEntity } from 'src/vehicles/entity/vehicles.entity';
import { EquipmentEntity } from 'src/equipment/entity/equipment.entity';
import { BookingsModule } from 'src/bookings/bookings.module';
import { BookingRulesModule } from 'src/booking-rules/booking-rules.module';
import { BookingsEntity } from 'src/bookings/entity/bookings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResourcesEntity,
      RoomsEntity,
      VehiclesEntity,
      EquipmentEntity,
      BookingsEntity,
    ]),
    BookingsModule,
    BookingRulesModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
