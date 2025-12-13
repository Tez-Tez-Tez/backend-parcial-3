import { BookingsEntity } from "src/bookings/entity/bookings.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Roles{
    user='user',
    admin='admin'
}

@Entity('users')
export class UsersEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'mail',nullable:false,unique:true,type:'varchar'})
    mail: string;

    @Column({name:'password',type:'varchar',nullable:false})
    password: string;

    @Column({name:'role',type:'enum',enum:Roles,default:Roles.user})
    role: Roles;

    @OneToMany(type=>BookingsEntity,BookingsEntity=>BookingsEntity.user)
    bookings: BookingsEntity[];
}