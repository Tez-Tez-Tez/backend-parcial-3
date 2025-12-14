import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsEntity } from 'src/bookings/entity/bookings.entity';
import configuration from 'src/config/configuration';
import { EquipmentEntity } from 'src/equipment/entity/equipment.entity';
import { BookingRulesEntity } from 'src/booking-rules/entity/booking-rules.entity';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';
import { RoomsEntity } from 'src/rooms/entity/rooms.entity';
import { UsersEntity } from 'src/users/entity/users.entity';
import { VehiclesEntity } from 'src/vehicles/entity/vehicles.entity';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    load: [configuration]
  }), TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'mysql',
      port: config.get('config.db.port'),
      host: config.get('config.db.host'),
      username: config.get('config.db.user'),
      database: config.get('config.db.name'),
      password: config.get('config.db.password'),
      ssl: config.get('config.db.ssl') === 'true' ? {
  rejectUnauthorized: false,
} : undefined,
      connectorPackage: 'mysql2',
      entities: [
        UsersEntity,
        BookingsEntity,
        ResourcesEntity,
        RoomsEntity,
        VehiclesEntity,
        EquipmentEntity,
        BookingRulesEntity
      ],
      synchronize: false,
      logging: true
    })
  })]
})
export class DatabaseModule { }
