import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsEnum, IsOptional, Min } from 'class-validator';
import { Status } from 'src/common/enums/resource.enums';

export class CreateRoomDto {
    @ApiProperty({
        description: 'Nombre de la sala',
        example: 'Sala de Conferencias A',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Capacidad de personas',
        example: 20,
        minimum: 1,
    })
    @IsInt()
    @Min(1)
    capacity: number;

    @ApiProperty({
        description: 'Estado de la sala',
        enum: Status,
        example: Status.available,
        required: false,
    })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}

export class UpdateRoomDto {
    @ApiProperty({
        description: 'Nombre de la sala',
        example: 'Sala de Conferencias A',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Capacidad de personas',
        example: 20,
        minimum: 1,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    capacity?: number;

    @ApiProperty({
        description: 'Estado de la sala',
        enum: Status,
        example: Status.maintenance,
        required: false,
    })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
