import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from 'src/users/entity/users.entity';
import { ResourcesEntity } from 'src/resources/entity/resources.entity';
import { TypeResource } from 'src/common/enums/resource.enums';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

@Entity('bookings')
export class BookingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.bookings, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @Column({ name: 'resource_id', type: 'int', nullable: false })
  resourceId: number;

  @Column({
    name: 'resource_type',
    type: 'enum',
    enum: TypeResource,
    nullable: false,
  })
  resourceType: TypeResource;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: false })
  endDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ResourcesEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn([
    { name: 'resource_id', referencedColumnName: 'id' },
    { name: 'resource_type', referencedColumnName: 'type' },
  ])
  resource?: ResourcesEntity;
}