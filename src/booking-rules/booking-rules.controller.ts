import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BookingRulesService } from './booking-rules.service';
import { CreateBookingRuleDto, UpdateBookingRuleDto } from './dto/booking-rules.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Booking Rules')
@Controller('booking-rules')
export class BookingRulesController {
    constructor(private readonly bookingRulesService: BookingRulesService) { }

    @ApiOperation({ summary: 'Crear nueva regla de reserva' })
    @ApiResponse({
        status: 201,
        description: 'Regla creada exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos',
    })
    @Post()
    create(@Body() rule: CreateBookingRuleDto) {
        return this.bookingRulesService.create(rule);
    }

    @ApiOperation({ summary: 'Obtener todas las reglas de reserva' })
    @ApiResponse({
        status: 200,
        description: 'Lista de reglas',
    })
    @Get()
    findAll() {
        return this.bookingRulesService.findAll();
    }

    @ApiOperation({ summary: 'Obtener una regla por ID' })
    @ApiResponse({ status: 200, description: 'Regla encontrada' })
    @ApiResponse({ status: 404, description: 'Regla no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la regla' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingRulesService.findOne(+id);
    }

    @ApiOperation({ summary: 'Actualizar regla existente' })
    @ApiResponse({ status: 200, description: 'Regla actualizada' })
    @ApiResponse({ status: 404, description: 'Regla no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la regla' })
    @Put(':id')
    update(@Param('id') id: string, @Body() rule: UpdateBookingRuleDto) {
        return this.bookingRulesService.update(+id, rule);
    }

    @ApiOperation({ summary: 'Eliminar regla' })
    @ApiResponse({ status: 200, description: 'Regla eliminada' })
    @ApiResponse({ status: 404, description: 'Regla no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la regla' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingRulesService.remove(+id);
    }
}
