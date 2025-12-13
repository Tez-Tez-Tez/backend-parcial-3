import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUser,UpdateUser } from './dto/users.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) private userRepo: Repository<UsersEntity>){}

    async getUsers(){
        const users = await this.userRepo.find();
        if(!users){
            throw new NotFoundException("Error al obtener usuarios")
        }
        return users;
    }

    async getUser(id:number){
        const user = await this.userRepo.findOne({where:{id}})
        if(!user){
            throw new NotFoundException("Error al buscar usuario")
        }
        return user;
    }

    async getUserFromMail(mail:string){
        const user = await this.userRepo.findOne({where:{mail}})
        if(!user){
            throw new NotFoundException("No existe usuario con ese mail")
        }
        return user;
    }

    async createUser(dto:CreateUser){
        try{
        const user = await this.userRepo.create(dto);
        const save = await this.userRepo.save(user);

        if(!save){
            throw new NotFoundException("Debes enviar los datos de usuario")
        }
        return save;
        }catch(err){
        throw err;
        }
    }

    async updateUser(id:number,dto:UpdateUser){
        try{
        const user= await this.userRepo.findOne({where:{id}})
        if(!user){
            throw new NotFoundException("Usuario no encontrado")
        }
        const up = await this.userRepo.preload({id,...dto})
        if(!up){
            throw new BadRequestException("Error al actualizar usuario")
        }

        const save= await this.userRepo.save(up);
        return save;
    }catch(err){
        throw err;
    }
    }
    async deleteUser(id:number){
        try{
        const user= await this.userRepo.findOne({where:{id}})
        if(!user){
            throw new NotFoundException("Usuario no encontrado")
        }
        const remove = await this.userRepo.remove(user);
        if(!remove){
            throw new BadRequestException("No se pudo eliminar el usuario")
        }
        return {message:"Usuario eliminado exitosamente"};
    }catch(err){
        throw err;
    }
    }

    async getBookingHistory(id: number) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ['bookings', 'bookings.resource'],
        });

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        }

        return user.bookings;
    }
}
