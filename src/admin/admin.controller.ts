import { Controller, Post, Param, ParseIntPipe, Get, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { BookingsService } from 'src/bookings/bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
    constructor(
        private readonly bookingsService: BookingsService,
        private readonly adminService: AdminService,
    ) { }

    @ApiOperation({ summary: 'Obtener estadísticas de reservas' })
    @ApiResponse({
        status: 200,
        description: 'Estadísticas de reservas',
        schema: {
            example: {
                totalBookings: 150,
                todayBookings: 5,
                activeBookings: 12,
                cancelledBookings: 8
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Solo administradores' })
    @Get('stats')
    @UseGuards(AuthGuard('jwt'))
    async getStats(@Request() req) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden acceder');
        }
        return this.adminService.getBookingStats();
    }

    @ApiOperation({ summary: 'Obtener estado en tiempo real de todos los recursos' })
    @ApiResponse({
        status: 200,
        description: 'Estado de recursos por tipo',
        schema: {
            example: {
                rooms: { available: 5, occupied: 2, maintenance: 1, retired: 0 },
                vehicles: { available: 3, occupied: 1, maintenance: 0, retired: 0 },
                equipment: { available: 10, occupied: 3, maintenance: 2, retired: 1 }
            }
        }
    })
    @Get('resources/status')
    @UseGuards(AuthGuard('jwt'))
    async getResourcesStatus(@Request() req) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden acceder');
        }
        return this.adminService.getResourcesStatus();
    }

    @ApiOperation({ summary: 'Obtener snapshot del estado actual de recursos' })
    @ApiResponse({
        status: 200,
        description: 'Snapshot detallado de cada recurso',
    })
    @Get('resources/snapshot')
    @UseGuards(AuthGuard('jwt'))
    async getResourcesSnapshot(@Request() req) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Solo administradores pueden acceder');
        }
        return this.adminService.getResourcesSnapshot();
    }

    @ApiOperation({ summary: 'Forzar cancelación de una reserva (solo admin)' })
    @ApiResponse({ status: 200, description: 'Reserva cancelada forzadamente' })
    @ApiResponse({ status: 403, description: 'Solo administradores pueden forzar cancelación' })
    @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
    @ApiParam({ name: 'id', description: 'ID de la reserva a cancelar' })
    @Post('bookings/:id/force-cancel')
    @UseGuards(AuthGuard('jwt'))
    async forceCancel(@Request() req, @Param('id', ParseIntPipe) id: number) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only admins can force cancel');
        }
        return this.bookingsService.cancel(id, req.user);
    }
}
