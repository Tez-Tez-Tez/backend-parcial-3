import { Controller, Post, Param, ParseIntPipe, Get, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { BookingsService } from 'src/bookings/bookings.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Get('stats')
    @UseGuards(AuthGuard('jwt'))
    async getStats() {
        return {
            message: 'Real-time stats not fully implemented yet, connect to WebSocket for live updates.',
        };
    }

    @Post('bookings/:id/force-cancel')
    @UseGuards(AuthGuard('jwt'))
    async forceCancel(@Request() req, @Param('id', ParseIntPipe) id: number) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Only admins can force cancel');
        }
        return this.bookingsService.cancel(id, req.user);
    }
}
