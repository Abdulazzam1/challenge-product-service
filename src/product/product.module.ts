// src/product/product.module.ts
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- IMPORT
import { Product } from './product.entity';     // <-- IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // <-- TAMBAHKAN INI (mendaftarkan entity)
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}