import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, IsOptional, IsArray, Min } from 'class-validator';
import { TypeResource } from 'src/common/enums/resource.enums';

export class CreateBookingRuleDto {
    @ApiProperty({
        description: 'Tipo de recurso al que aplica la regla (null para regla global)',
        enum: TypeResource,
        example: TypeResource.room,
        required: false,
    })
    @IsOptional()
    @IsEnum(TypeResource)
    resourceType?: TypeResource;

    @ApiProperty({
        description: 'ID del recurso específico (null para regla por tipo)',
        example: 1,
        required: false,
    })
    @IsOptional()
    @IsInt()
    resourceId?: number;

    @ApiProperty({
        description: 'Duración máxima de la reserva en minutos',
        example: 120,
        default: 120,
    })
    @IsInt()
    @Min(1)
    maxDuration: number;

    @ApiProperty({
        description: 'Anticipación mínima para reservar en minutos',
        example: 30,
        default: 0,
    })
    @IsInt()
    @Min(0)
    minAnticipation: number;

    @ApiProperty({
        description: 'Hora de inicio permitida (formato HH:MM)',
        example: '08:00',
        default: '00:00',
    })
    @IsString()
    allowedStartHour: string;

    @ApiProperty({
        description: 'Hora de fin permitida (formato HH:MM)',
        example: '18:00',
        default: '23:59',
    })
    @IsString()
    allowedEndHour: string;

    @ApiProperty({
        description: 'Días de la semana bloqueados (0=Domingo, 6=Sábado)',
        example: [0, 6],
        required: false,
        type: [Number],
    })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    blockedDays?: number[];

    @ApiProperty({
        description: 'Máximo de reservas activas por usuario',
        example: 5,
        default: 5,
    })
    @IsInt()
    @Min(1)
    maxActiveBookingsPerUser: number;
}

export class UpdateBookingRuleDto {
    @ApiProperty({
        description: 'Tipo de recurso al que aplica la regla',
        enum: TypeResource,
        required: false,
    })
    @IsOptional()
    @IsEnum(TypeResource)
    resourceType?: TypeResource;

    @ApiProperty({
        description: 'ID del recurso específico',
        required: false,
    })
    @IsOptional()
    @IsInt()
    resourceId?: number;

    @ApiProperty({
        description: 'Duración máxima de la reserva en minutos',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    maxDuration?: number;

    @ApiProperty({
        description: 'Anticipación mínima para reservar en minutos',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    minAnticipation?: number;

    @ApiProperty({
        description: 'Hora de inicio permitida (formato HH:MM)',
        required: false,
    })
    @IsOptional()
    @IsString()
    allowedStartHour?: string;

    @ApiProperty({
        description: 'Hora de fin permitida (formato HH:MM)',
        required: false,
    })
    @IsOptional()
    @IsString()
    allowedEndHour?: string;

    @ApiProperty({
        description: 'Días de la semana bloqueados',
        required: false,
        type: [Number],
    })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    blockedDays?: number[];

    @ApiProperty({
        description: 'Máximo de reservas activas por usuario',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    maxActiveBookingsPerUser?: number;
}
