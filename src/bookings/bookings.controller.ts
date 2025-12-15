import { Controller, Post, Body, UseGuards, Request, Patch, Param, ParseIntPipe, Delete, Get, Query,ForbiddenException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/bookings.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TypeResource } from 'src/common/enums/resource.enums';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @ApiOperation({ summary: 'Crear nueva reserva' })
    @ApiResponse({
        status: 201,
        description: 'Reserva creada exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Error de validación',
        schema: {
            example: {
                statusCode: 400,
                message: 'El recurso ya está reservado en ese horario'
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'No autenticado'
    })
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(req.user, createBookingDto);
    }

    @ApiOperation({ summary: 'Actualizar reserva existente' })
    @ApiResponse({ status: 200, description: 'Reserva actualizada' })
    @ApiResponse({ status: 400, description: 'Solo se pueden modificar reservas pendientes' })
    @ApiResponse({ status: 403, description: 'Sin permiso para modificar esta reserva' })
    @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la reserva' })
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookingDto: UpdateBookingDto,
    ) {
        return this.bookingsService.update(id, req.user, updateBookingDto);
    }

    @ApiOperation({ summary: 'Cancelar reserva' })
    @ApiResponse({ status: 200, description: 'Reserva cancelada exitosamente' })
    @ApiResponse({ status: 400, description: 'La reserva ya está cancelada' })
    @ApiResponse({ status: 403, description: 'Sin permiso para cancelar esta reserva' })
    @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la reserva' })
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    cancel(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.cancel(id, req.user);
    }

    @ApiOperation({ summary: 'Buscar recursos disponibles en un rango de fechas' })
    @ApiResponse({
        status: 200,
        description: 'Lista de recursos disponibles',
        schema: {
            example: [
                { id: 1, type: 'ROOM', name: 'Sala A', capacity: 10, status: 'available' }
            ]
        }
    })
    @ApiQuery({ name: 'start', description: 'Fecha de inicio (ISO 8601)', example: '2025-12-15T08:00:00.000Z' })
    @ApiQuery({ name: 'end', description: 'Fecha de fin (ISO 8601)', example: '2025-12-15T10:00:00.000Z' })
    @ApiQuery({ name: 'type', description: 'Tipo de recurso', enum: TypeResource, required: false })
    @Get('available')
    async findAvailable(
        @Query('start') start: string,
        @Query('end') end: string,
        @Query('type') type?: TypeResource,
    ) {
        return this.bookingsService.findAvailableResources(
            new Date(start),
            new Date(end),
            type
        );
    }

    @ApiOperation({ summary: 'Obtener historial de reservas de un usuario' })
    @ApiResponse({ status: 200, description: 'Historial de reservas del usuario' })
    @ApiParam({ name: 'userId', description: 'ID del usuario' })
    @UseGuards(AuthGuard('jwt'))
    @Get('history/user/:userId')
    async getUserHistory(@Param('userId', ParseIntPipe) userId: number, @Request() req) {
    // Solo admins o el mismo usuario pueden ver su historial
    if (req.user.role !== 'admin' && req.user.id !== userId) {
        throw new ForbiddenException('No puedes ver el historial de otros usuarios');
    }
    return this.bookingsService.getUserHistory(userId);
}

    @ApiOperation({ summary: 'Obtener historial de reservas de un recurso' })
    @ApiResponse({ status: 200, description: 'Historial de reservas del recurso' })
    @ApiParam({ name: 'resourceId', description: 'ID del recurso' })
    @ApiQuery({ name: 'resourceType', description: 'Tipo de recurso', enum: TypeResource })
    @UseGuards(AuthGuard('jwt'))
    @Get('history/resource/:resourceId')
    async getResourceHistory(
        @Param('resourceId', ParseIntPipe) resourceId: number,
        @Query('resourceType') resourceType: TypeResource,
    ) {
        return this.bookingsService.getResourceHistory(resourceId, resourceType);
    }
}
