// src/product/product.module.ts
import { Module, forwardRef } from '@nestjs/common'; // <-- 1. Tambah forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

// 2. Import modul RabbitMQ kita (bukan dari @golevelup)
import { RabbitMQConsumerModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),

    // 3. Import modul RabbitMQ menggunakan forwardRef
    forwardRef(() => RabbitMQConsumerModule),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService], // Ini tetap penting untuk RabbitMQConsumerModule
})
export class ProductModule {}