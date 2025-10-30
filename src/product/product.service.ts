// src/product/product.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'; // <-- 1. IMPORT BARU

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly amqpConnection: AmqpConnection, // <-- 2. INJECT BARU
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    
    // Simpan produk ke database
    const savedProduct = await this.productRepository.save(product);

    // --- 3. (BARU) Publish event product.created ---
    const exchange = 'products_exchange';
    const routingKey = 'product.created';
    try {
      // Publish event dengan payload berisi data produk yang baru disimpan
      await this.amqpConnection.publish(exchange, routingKey, savedProduct);
      this.logger.log(`Event ${routingKey} published for Product ID ${savedProduct.id}`);
    } catch (error) {
      // Jika publish gagal, catat error tapi jangan hentikan proses
      this.logger.error(`Failed to publish ${routingKey} event for Product ID ${savedProduct.id}`, error);
    }
    // -----------------------------------------

    return savedProduct; // Kembalikan produk yang sudah disimpan
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOneBy({ id });
  }

  // Fungsi save() ini tetap ada, digunakan oleh RabbitMQConsumer
  async save(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }
}