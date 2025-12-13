import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoomsEntity } from 'src/rooms/entity/rooms.entity';
import { VehiclesEntity } from 'src/vehicles/entity/vehicles.entity';
import { EquipmentEntity } from 'src/equipment/entity/equipment.entity';
import { TypeResource } from 'src/common/enums/resource.enums';
import { Column } from 'typeorm';

@Entity('resources')
export class ResourcesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'enum', enum: TypeResource })
  type: TypeResource;

  @OneToOne(() => RoomsEntity, (room) => room.resource)
  room: RoomsEntity;

  @OneToOne(() => VehiclesEntity, (vehicle) => vehicle.resource)
  vehicle: VehiclesEntity;

  @OneToOne(() => EquipmentEntity, (equipment) => equipment.resource)
  equipment: EquipmentEntity;
}