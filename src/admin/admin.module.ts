import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { BookingsModule } from 'src/bookings/bookings.module';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsEntity } from 'src/bookings/entity/bookings.entity';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';

@Module({
    imports: [
        BookingsModule,
        TypeOrmModule.forFeature([BookingsEntity, ResourcesEntity]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
