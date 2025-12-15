import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { BookingRulesService } from './booking-rules.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBookingRuleDto, UpdateBookingRuleDto } from './dto/booking-rules.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Booking Rules')
@Controller('booking-rules')
export class BookingRulesController {
    constructor(private readonly bookingRulesService: BookingRulesService) { }

    @ApiOperation({ summary: 'Crear nueva regla de reserva (Solo Admin)' })
    @ApiResponse({ status: 201, description: 'Regla creada exitosamente' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden crear reglas' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Request() req, @Body() createDto: CreateBookingRuleDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden crear reglas de reserva');
        }
        return this.bookingRulesService.create(createDto);
    }

    @ApiOperation({ summary: 'Obtener todas las reglas de reserva' })
    @ApiResponse({ status: 200, description: 'Lista de reglas de reserva' })
    @Get()
    findAll() {
        return this.bookingRulesService.findAll();
    }

    @ApiOperation({ summary: 'Obtener regla de reserva por ID' })
    @ApiResponse({ status: 200, description: 'Regla encontrada' })
    @ApiResponse({ status: 404, description: 'Regla no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la regla' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bookingRulesService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar regla de reserva (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Regla actualizada' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden actualizar reglas' })
    @ApiResponse({ status: 404, description: 'Regla no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la regla' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateBookingRuleDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden actualizar reglas de reserva');
        }
        return this.bookingRulesService.update(id, updateDto);
    }

    @ApiOperation({ summary: 'Eliminar regla de reserva (Solo Admin)' })
    @ApiResponse({ status: 200, description: 'Regla eliminada' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden eliminar reglas' })
    @ApiResponse({ status: 404, description: 'Regla no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la regla' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden eliminar reglas de reserva');
        }
        return this.bookingRulesService.remove(id);
    }
}
