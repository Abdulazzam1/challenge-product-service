// src/rabbitmq/rabbitmq.consumer.ts
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
// Import ProductService
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.entity'; // <-- IMPORT Product Entity

// --- TAMBAHAN IMPORT UNTUK CACHE ---
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

// Ini adalah "kontrak" payload kita dari Fase 0
interface OrderCreatedEvent {
  orderId: string;
  productId: string;
  quantityOrdered: number;
  timestamp: string;
}

@Injectable()
export class RabbitMQConsumer {
  private readonly logger = new Logger(RabbitMQConsumer.name);

  // 1. Inject ProductService DAN CACHE_MANAGER di constructor
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @RabbitSubscribe({
    exchange: 'orders_exchange',
    routingKey: 'order.created',
    queue: 'q.products.order_created',
    queueOptions: {
      durable: true,
    },
  })
  // 2. Ubah tipe 'msg' dari 'any' menjadi tipe 'OrderCreatedEvent'
  public async handleOrderCreated(msg: OrderCreatedEvent) {
    this.logger.log(`=================================================`);
    this.logger.log(`✅ EVENT RECEIVED (order.created)!`);
    this.logger.log(`Payload: ${JSON.stringify(msg)}`);

    try {
      // 3. Cari produk berdasarkan ID dari payload
      const product = await this.productService.findOne(msg.productId);

      if (!product) {
        this.logger.error(
          `Product with ID ${msg.productId} not found. Skipping.`,
        );
        return; // Berhenti jika produk tidak ada
      }

      // 4. Lakukan logika bisnis (pengurangan stok)
      const newQty = product.qty - msg.quantityOrdered;

      if (newQty < 0) {
        this.logger.warn(
          `Not enough stock for Product ID ${msg.productId}. Stock remains ${product.qty}.`,
        );
        // Di dunia nyata, kita akan publish event "order.failed"
        return; // Berhenti jika stok tidak cukup
      }

      // 5. Simpan qty baru ke database
      product.qty = newQty;
      await this.productService.save(product); // Kita perlu tambahkan 'save' ke service

      this.logger.log(
        `Successfully reduced stock for Product ID ${msg.productId}. New Qty: ${newQty}`,
      );

      // --- 6. (BARU) LAKUKAN CACHE EVICTION ---
      // Kunci cache HARUS cocok dengan yang dibuat oleh CacheInterceptor
      // di ProductController. Secara default, itu adalah URL path-nya.
      const cacheKey = `/products/${product.id}`;
      await this.cacheManager.del(cacheKey);
      this.logger.log(
        `CACHE EVICTED for Product ID ${product.id} (Key: ${cacheKey})`,
      );
      // -------------------------------------
    } catch (error) {
      this.logger.error(
        `Failed to process order.created event for Product ID ${msg.productId}`,
        error,
      );
    }

    this.logger.log(`=================================================`);
  }
}