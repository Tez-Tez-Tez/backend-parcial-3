import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ParseIntPipe, ForbiddenException, Request } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/equipment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Equipment')
@ApiBearerAuth()
@Controller('equipment')
export class EquipmentController {
    constructor(private readonly equipmentService: EquipmentService) { }

    @ApiOperation({ summary: 'Crear nuevo equipo (Solo Admin)' })
    @ApiResponse({
        status: 201,
        description: 'Equipo creado exitosamente',
    })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden crear equipos' })
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Request() req, @Body() createEquipmentDto: CreateEquipmentDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden crear equipos');
        }
        return this.equipmentService.create(createEquipmentDto);
    }

    @ApiOperation({ summary: 'Obtener todos los equipos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de equipos',
    })
    @Get()
    findAll() {
        return this.equipmentService.findAll();
    }

    @ApiOperation({ summary: 'Obtener equipo por ID' })
    @ApiResponse({ status: 200, description: 'Equipo encontrado' })
    @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del equipo' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.equipmentService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar equipo (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Equipo actualizado' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar equipos' })
    @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del equipo' })
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateEquipmentDto: UpdateEquipmentDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden actualizar equipos');
        }
        return this.equipmentService.update(id, updateEquipmentDto);
    }

    @ApiOperation({ summary: 'Eliminar equipo (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Equipo eliminado' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar equipos' })
    @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
    @ApiParam({ name: 'id', description: 'ID del equipo' })
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden eliminar equipos');
        }
        return this.equipmentService.remove(id);
    }
}
