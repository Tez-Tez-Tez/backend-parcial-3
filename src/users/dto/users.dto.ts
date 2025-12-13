import { IsEmail, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { Roles } from "../entity/users.entity";


export class CreateUser{

    @IsNotEmpty()
    @IsEmail()
    mail: string;

    @IsString()
    @IsNotEmpty()
    @Min(3)
    password: string;

    @IsString()
    @IsOptional()
    role?: Roles;
}

export class UpdateUser{

    @IsEmail()
    @IsOptional()
    mail?: string;

    @IsString()
    @Min(3)
    @IsOptional()
    password?: string;

}

export class Login{

    @IsEmail()
    @IsNotEmpty()
    mail: string;

    @IsString()
    @Min(3)
    @IsNotEmpty()
    password: string;

}