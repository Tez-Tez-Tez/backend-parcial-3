import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/common/enums/resource.enums';

export class CreateEquipmentDto {
    @ApiProperty({
        description: 'Nombre del equipo',
        example: 'Proyector Epson',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Número de serie del equipo',
        example: 'SN-12345678',
    })
    @IsString()
    serial_number: string;

    @ApiProperty({
        description: 'Estado del equipo',
        enum: Status,
        example: Status.available,
        required: false,
    })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}

export class UpdateEquipmentDto {
    @ApiProperty({
        description: 'Nombre del equipo',
        example: 'Proyector Epson',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Número de serie del equipo',
        example: 'SN-12345678',
        required: false,
    })
    @IsOptional()
    @IsString()
    serial_number?: string;

    @ApiProperty({
        description: 'Estado del equipo',
        enum: Status,
        example: Status.maintenance,
        required: false,
    })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
