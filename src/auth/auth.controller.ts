import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser, Login } from 'src/users/dto/users.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authController: AuthService) { }

    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente',
        schema: {
            example: {
                id: 1,
                mail: 'user@example.com',
                role: 'user'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'El correo electrónico ya está registrado' })
    @Post()
    async register(@Body() dto: CreateUser) {
        return await this.authController.register(dto)
    }

    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        schema: {
            example: {
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    @Post('/login')
    async login(@Body() dto: Login) {
        return await this.authController.login(dto)
    }
}
