import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthStrategy } from './strategy/strategy.jwt';

@Module({
  imports:[TypeOrmModule.forFeature([UsersEntity]),PassportModule.register({defaultStrategy:'jwt'}),JwtModule.registerAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>({
      secret: config.get('config.jwt'),
      signOptions: {expiresIn:'1h'}
    })
  })],
  controllers: [AuthController],
  providers: [AuthService,UsersService,AuthStrategy]
})
export class AuthModule {}
