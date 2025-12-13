import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsEntity } from './entity/bookings.entity';
import { BookingRulesModule } from 'src/booking-rules/booking-rules.module';
import { BookingsGateway } from './bookings.gateway';

import { ResourcesEntity } from 'src/resources/entity/resources.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingsEntity, ResourcesEntity]), BookingRulesModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsGateway],
  exports: [BookingsService]
})
export class BookingsModule { }
