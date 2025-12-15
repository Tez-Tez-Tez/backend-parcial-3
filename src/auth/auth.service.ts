```typescript
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser, Login } from 'src/users/dto/users.dto';
import { UsersEntity } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
        throw err;
    }
    }

    async login(dto:Login){
        try{
        const user = await this.authService.getUserFromMail(dto.mail)
        if(!user){
            throw new NotFoundException("No se encontro un usuario con ese mail")
        }
        const validate = await bcrypt.compare(dto.password,user.password)
        if(!validate){
            throw new BadRequestException("Credenciales invalidadas")
        }
        const payload = {id:user.id,role:user.role}
        const token = await this.jwtService.sign(payload)
        return {access_token:token,user:{id:user.id,mail:user.mail}};
    }catch(err){
        throw err;
    }
    }
}
