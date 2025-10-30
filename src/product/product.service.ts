// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findOne(id: string): Promise<Product | null> { // <-- Perbaikan 1
    return this.productRepository.findOneBy({ id });
  }

  // --- PERBAIKAN 2: TAMBAHKAN FUNGSI INI ---
  async save(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }
  // ------------------------------------
}