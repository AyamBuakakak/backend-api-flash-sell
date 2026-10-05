import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';


import { Order } from './order.entity.js';
import { Product } from '../../product/entities/product.entity.js';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Relation<Order>;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ name: 'price_at_purchase', type: 'decimal', precision: 10, scale: 2 })
    priceAtPurchase: number;
}
