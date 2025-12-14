import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ParseIntPipe, ForbiddenException, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicles.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) { }

    @ApiOperation({ summary: 'Crear nuevo vehículo (Solo Admin)' })
    @ApiResponse({
        status: 201,
        description: 'Vehículo creado exitosamente',
    })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden crear vehículos' })
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Request() req, @Body() createVehicleDto: CreateVehicleDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden crear vehículos');
        }
        return this.vehiclesService.create(createVehicleDto);
    }

    @ApiOperation({ summary: 'Obtener todos los vehículos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de vehículos',
    })
    @Get()
    findAll() {
        return this.vehiclesService.findAll();
    }

    @ApiOperation({ summary: 'Obtener vehículo por ID' })
    @ApiResponse({ status: 200, description: 'Vehículo encontrado' })
    @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del vehículo' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.vehiclesService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar vehículo (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Vehículo actualizado' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar vehículos' })
    @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del vehículo' })
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateVehicleDto: UpdateVehicleDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden actualizar vehículos');
        }
        return this.vehiclesService.update(id, updateVehicleDto);
    }

    @ApiOperation({ summary: 'Eliminar vehículo (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Vehículo eliminado' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar vehículos' })
    @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del vehículo' })
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden eliminar vehículos');
        }
        return this.vehiclesService.remove(id);
    }
}
