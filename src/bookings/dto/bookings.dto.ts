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

export class CreateBookingDto {
  @IsInt({ message: 'El ID del recurso debe ser un número' })
  @Min(1, { message: 'El ID del recurso debe ser mayor a 0' })
  resourceId: number;

  @IsEnum(TypeResource, {
    message: 'Tipo de recurso inválido. Use: ROOM, VEHICLE o EQUIPMENT',
  })
  resourceType: TypeResource;

  @IsDateString({}, { message: 'startDate debe ser una fecha válida (ISO)' })
  startDate: string;

  @IsDateString({}, { message: 'endDate debe ser una fecha válida (ISO)' })
  endDate: string;

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