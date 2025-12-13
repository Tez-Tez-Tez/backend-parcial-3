import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser, Login } from 'src/users/dto/users.dto';

@Controller('auth')
export class AuthController {
    constructor(private authController:AuthService){}
    
    @Post()
    async register(@Body()dto:CreateUser){
        return await this.authController.register(dto)
    }

    @Post('/login')
    async login(@Body()dto:Login){
        return await this.authController.login(dto)
    }
}
