import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, ParseIntPipe, ForbiddenException, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/rooms.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @ApiOperation({ summary: 'Crear nueva sala (Solo Admin)' })
    @ApiResponse({
        status: 201,
        description: 'Sala creada exitosamente',
    })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden crear salas' })
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Request() req, @Body() createRoomDto: CreateRoomDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden crear salas');
        }
        return this.roomsService.create(createRoomDto);
    }

    @ApiOperation({ summary: 'Obtener todas las salas' })
    @ApiResponse({
        status: 200,
        description: 'Lista de salas',
    })
    @Get()
    findAll() {
        return this.roomsService.findAll();
    }

    @ApiOperation({ summary: 'Obtener sala por ID' })
    @ApiResponse({ status: 200, description: 'Sala encontrada' })
    @ApiResponse({ status: 404, description: 'Sala no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la sala' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.roomsService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar sala (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Sala actualizada' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar salas' })
    @ApiResponse({ status: 404, description: 'Sala no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la sala' })
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateRoomDto: UpdateRoomDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden actualizar salas');
        }
        return this.roomsService.update(id, updateRoomDto);
    }

    @ApiOperation({ summary: 'Eliminar sala (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Sala eliminada' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar salas' })
    @ApiResponse({ status: 404, description: 'Sala no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la sala' })
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden eliminar salas');
        }
        return this.roomsService.remove(id);
    }
}
