import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
    imports: [BookingsModule],
    controllers: [AdminController],
})
export class AdminModule { }
