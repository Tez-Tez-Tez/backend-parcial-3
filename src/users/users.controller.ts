import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('users')
@UseGuards(JwtGuard,RoleGuard)
export class UsersController {
    constructor(private usersController:UsersService){}
    
    @Roles('admin')
    @Get()
    async getUsers(){
        return await this.usersController.getUsers();
    }

    @Roles('admin')
    @Get(':id/bookings')
    async getBookingHistory(@Param('id') id: string) {
        return await this.usersController.getBookingHistory(+id);
    }
}
