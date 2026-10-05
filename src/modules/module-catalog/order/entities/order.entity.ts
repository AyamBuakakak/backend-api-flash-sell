import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    Relation,
} from 'typeorm';

import { OrderItem } from './order-item.entity.js';

export type OrderStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'total_price', type: 'decimal', precision: 12, scale: 2 })
    totalPrice: number;

    @Column({
        type: 'enum',
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
    })
    status: OrderStatus;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: Relation<OrderItem>[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}