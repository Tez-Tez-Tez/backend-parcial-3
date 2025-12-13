import { Column, Entity, PrimaryGeneratedColumn,JoinColumn,OneToOne} from "typeorm";
import { ResourcesEntity } from "src/resources/entity/resources.entity";
import { Status } from "src/common/enums/resource.enums";

@Entity('vehicles')
export class VehiclesEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:'brand',nullable:false,type:'varchar'})
    brand: string;

    @Column({name:'model',type:'varchar',nullable:false})
    model: string;

    @Column({name:'plate',unique:true,type:'varchar',nullable:false})
    plate: string;

    @Column({name:'status',type:'enum', enum:Status, default:Status.available})
    status: Status;
    
    @OneToOne(type=>ResourcesEntity,ResourcesEntity=>ResourcesEntity.id)
    @JoinColumn({name:'resource_id'})
    resource: ResourcesEntity;
}