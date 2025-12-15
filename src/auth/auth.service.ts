import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUser, Login } from 'src/users/dto/users.dto';
import { UsersEntity } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private authService: UsersService,
        private jwtService: JwtService
    ) { }

    async register(dto: CreateUser) {
        try {
            if (!dto) {
                throw new BadRequestException("Datos necesarios para registrarse")
            }

            // Check if email already exists
            const existingUser = await this.authService.findUserByMail(dto.mail);
            if (existingUser) {
                throw new BadRequestException('El correo electrónico ya está registrado');
            }

            const salt = await bcrypt.genSalt(10)
            dto.password = await bcrypt.hash(dto.password, salt)
            const user = await this.authService.createUser(dto);
            if (!user) {
                throw new NotFoundException("Error al crear usuario")
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    async login(dto: Login) {
        try {
            const user = await this.authService.getUserFromMail(dto.mail)
            if (!user) {
                throw new NotFoundException("No se encontro un usuario con ese mail")
            }
            const validate = await bcrypt.compare(dto.password, user.password)
            if (!validate) {
                throw new BadRequestException("Credenciales invalidadas")
            }
            const payload = { id: user.id, role: user.role }
            const token = await this.jwtService.sign(payload)
            return { access_token: token, user: { id: user.id, mail: user.mail } };
        } catch (err) {
            throw err;
        }
    }
}
