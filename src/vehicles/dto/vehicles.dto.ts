import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/common/enums/resource.enums';

export class CreateVehicleDto {
    @ApiProperty({
        description: 'Marca del vehículo',
        example: 'Toyota',
    })
    @IsString()
    brand: string;

    @ApiProperty({
        description: 'Modelo del vehículo',
        example: 'Corolla',
    })
    @IsString()
    model: string;

    @ApiProperty({
        description: 'Placa del vehículo',
        example: 'ABC-123',
    })
    @IsString()
    plate: string;

    @ApiProperty({
        description: 'Estado del vehículo',
        enum: Status,
        example: Status.available,
        required: false,
    })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}

export class UpdateVehicleDto {
    @ApiProperty({
        description: 'Marca del vehículo',
        example: 'Toyota',
        required: false,
    })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiProperty({
        description: 'Modelo del vehículo',
        example: 'Corolla',
        required: false,
    })
    @IsOptional()
    @IsString()
    model?: string;

    @ApiProperty({
        description: 'Placa del vehículo',
        example: 'ABC-123',
        required: false,
    })
    @IsOptional()
    @IsString()
    plate?: string;

    @ApiProperty({
        description: 'Estado del vehículo',
        enum: Status,
        example: Status.maintenance,
        required: false,
    })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
