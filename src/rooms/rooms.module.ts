import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsEntity } from './entity/rooms.entity';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';


@Module({
  imports: [TypeOrmModule.forFeature([RoomsEntity, ResourcesEntity])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService]
})
export class RoomsModule { }
