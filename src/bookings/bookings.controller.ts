import { Controller, Post, Body, UseGuards, Request, Patch, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/bookings.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(req.user, createBookingDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookingDto: UpdateBookingDto,
    ) {
        return this.bookingsService.update(id, req.user, updateBookingDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    cancel(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.bookingsService.cancel(id, req.user);
    }
}
