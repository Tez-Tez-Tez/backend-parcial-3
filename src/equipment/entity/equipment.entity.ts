import { Entity,Column, PrimaryGeneratedColumn,JoinColumn,OneToOne } from "typeorm";
import { ResourcesEntity } from "src/resources/entity/resources.entity";
import { Status } from "src/common/enums/resource.enums";

@Entity('equipment')
export class EquipmentEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'name',nullable:false,unique:true,type:'varchar'})
    name: string;

    @Column({name:'serial_number',unique:true,nullable:false,type:'varchar'})
    serial_number: string;

    @Column({name:'status',type:'enum', enum:Status, default:Status.available})
    status: Status;

    @OneToOne(type=>ResourcesEntity,ResourcesEntity=>ResourcesEntity.id)
    @JoinColumn({name:'resource_id'})
    resource: ResourcesEntity;
}