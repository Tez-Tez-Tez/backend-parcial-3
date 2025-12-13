import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingRulesService } from './booking-rules.service';
import { BookingRulesController } from './booking-rules.controller';
import { BookingRulesEntity } from './entity/booking-rules.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BookingRulesEntity])],
    controllers: [BookingRulesController],
    providers: [BookingRulesService],
    exports: [BookingRulesService],
})
export class BookingRulesModule { }
