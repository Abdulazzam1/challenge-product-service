// src/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

// --- Import untuk Caching ---
import {
  CacheInterceptor,
  // CacheKey DIHAPUS untuk menggunakan key dinamis (per-URL)
  CacheTTL,
  CACHE_MANAGER,
  Cache,
} from '@nestjs/cache-manager';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,

    // Inject CACHE_MANAGER
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    // === PERBAIKAN ===
    // Logika cache .reset() dihapus total dari method create.
    // Method ini sekarang HANYA bertanggung jawab untuk membuat produk.
    // Eviksi cache akan ditangani oleh RabbitMQConsumer saat event diterima.
    // =================

    return this.productService.create(createProductDto);
  }

  @UseInterceptors(CacheInterceptor)
  // @CacheKey statis dihapus agar NestJS menggunakan URL (dinamis per ID)
  // sebagai cache key. Ini PENTING agar GET /products/1 dan
  // GET /products/2 memiliki cache yang berbeda.
  @CacheTTL(10 * 60 * 1000) // Cache selama 10 menit
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}