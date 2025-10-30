// src/product/product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products') // Nama tabel di database
export class Product {
  @PrimaryGeneratedColumn('uuid') // Sesuai desain kita: Primary Key, UUID
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Sesuai desain kita: decimal(10, 2)
  price: number;

  @Column('integer')
  qty: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) // Sesuai desain kita
  createdAt: Date;
}