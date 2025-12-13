import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TypeResource } from 'src/common/enums/resource.enums';

@Entity('booking_rules')
export class BookingRulesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'resource_type',
        type: 'enum',
        enum: TypeResource,
        nullable: true,
    })
    resourceType: TypeResource;

    @Column({ name: 'resource_id', type: 'int', nullable: true })
    resourceId: number;

    @Column({ name: 'max_duration', type: 'int', default: 120 }) // minutes
    maxDuration: number;

    @Column({ name: 'min_anticipation', type: 'int', default: 0 }) // minutes
    minAnticipation: number;

    @Column({ name: 'allowed_start_hour', type: 'varchar', length: 5, default: '00:00' })
    allowedStartHour: string;

    @Column({ name: 'allowed_end_hour', type: 'varchar', length: 5, default: '23:59' })
    allowedEndHour: string;

    @Column({ name: 'blocked_days', type: 'simple-array', nullable: true })
    blockedDays: number[]; // 0=Sunday, 6=Saturday

    @Column({ name: 'max_active_bookings_per_user', type: 'int', default: 5 })
    maxActiveBookingsPerUser: number;
}
