import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Roles } from "../entity/users.entity";


export class CreateUser {

    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'La contraseña debe tener al menos 3 caracteres' })
    password: string;

    @IsString()
    @IsOptional()
    role?: Roles;
}

export class UpdateUser {

    @IsEmail()
    @IsOptional()
    mail?: string;

    @IsString()
    @MinLength(3, { message: 'La contraseña debe tener al menos 3 caracteres' })
    @IsOptional()
    password?: string;

}

export class Login {

    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @IsString()
    @MinLength(3, { message: 'La contraseña debe tener al menos 3 caracteres' })
    @IsNotEmpty()
    password: string;

}