import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BookingRulesService } from './booking-rules.service';
import { BookingRulesEntity } from './entity/booking-rules.entity';

@Controller('booking-rules')
export class BookingRulesController {
    constructor(private readonly bookingRulesService: BookingRulesService) { }

    @Post()
    create(@Body() rule: Partial<BookingRulesEntity>) {
        return this.bookingRulesService.create(rule);
    }

    @Get()
    findAll() {
        return this.bookingRulesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingRulesService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() rule: Partial<BookingRulesEntity>) {
        return this.bookingRulesService.update(+id, rule);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookingRulesService.remove(+id);
    }
}
