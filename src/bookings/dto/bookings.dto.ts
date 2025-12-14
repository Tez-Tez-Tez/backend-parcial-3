// src/bookings/dto/create-booking.dto.ts
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { TypeResource } from 'src/common/enums/resource.enums';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID del recurso a reservar',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'El ID del recurso debe ser un número' })
  @Min(1, { message: 'El ID del recurso debe ser mayor a 0' })
  resourceId: number;

  @ApiProperty({
    description: 'Tipo de recurso',
    enum: TypeResource,
    example: TypeResource.room,
  })
  @IsEnum(TypeResource, {
    message: 'Tipo de recurso inválido. Use: ROOM, VEHICLE o EQUIPMENT',
  })
  resourceType: TypeResource;

  @ApiProperty({
    description: 'Fecha y hora de inicio de la reserva (ISO 8601)',
    example: '2025-12-15T08:00:00.000Z',
  })
  @IsDateString({}, { message: 'startDate debe ser una fecha válida (ISO)' })
  startDate: string;

  @ApiProperty({
    description: 'Fecha y hora de fin de la reserva (ISO 8601)',
    example: '2025-12-15T10:00:00.000Z',
  })
  @IsDateString({}, { message: 'endDate debe ser una fecha válida (ISO)' })
  endDate: string;

  @ApiProperty({
    description: 'Propósito de la reserva',
    example: 'Reunión de equipo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El propósito debe ser texto' })
  purpose?: string;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  // Hereda todos los campos de CreateBookingDto, pero todos opcionales
  @IsOptional()
  @IsDateString({}, { message: 'startDate debe ser una fecha válida (ISO)' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endDate debe ser una fecha válida (ISO)' })
  endDate?: string;

  @IsOptional()
  @IsString({ message: 'El propósito debe ser texto' })
  purpose?: string;
}