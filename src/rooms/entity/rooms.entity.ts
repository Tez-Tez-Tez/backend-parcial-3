import { ResourcesEntity } from "src/resources/entity/resources.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "src/common/enums/resource.enums";

@Entity('rooms')
export class RoomsEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'name',type:'varchar',unique:true, nullable:false})
    name: string;

    @Column({name:'capacity',nullable:false,type:'int'})
    capacity: number;

    @Column({name:'status',type:'enum', enum:Status, default:Status.available})
    status: Status;

    @OneToOne(type=>ResourcesEntity,ResourcesEntity=>ResourcesEntity.id)
    @JoinColumn({name:'resource_id'})
    resource: ResourcesEntity;
}