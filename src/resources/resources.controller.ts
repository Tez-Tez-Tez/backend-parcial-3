import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { FindAvailabilityDto } from './dto/find-availability.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('availability')
  findAvailable(@Body() findAvailabilityDto: FindAvailabilityDto) {
    return this.resourcesService.findAvailable(findAvailabilityDto);
  }

  @Get(':id/bookings')
  getBookingHistory(@Param('id') id: string) {
    return this.resourcesService.getBookingHistory(+id);
  }
}
