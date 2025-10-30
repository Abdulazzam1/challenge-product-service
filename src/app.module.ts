// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitMQConsumerModule } from './rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- IMPORT TypeORM
import { CacheModule } from '@nestjs/cache-manager'; // <-- IMPORT Cache
import { redisStore } from 'cache-manager-redis-store'; // <-- IMPORT Redis Store
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    // 1. Modul RabbitMQ (Sudah ada)
    RabbitMQConsumerModule,

    // 2. Modul Cache (Redis)
    CacheModule.registerAsync({
      isGlobal: true, // Membuat modul cache tersedia di semua modul lain
      useFactory: async () => ({
        store: await redisStore({
          // URL ini mengambil dari environment variable di docker-compose.yml
          url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
          ttl: 10 * 60, // Time-to-live cache 10 menit
        }),
      }),
    }),

    // 3. Modul Database (PostgreSQL)
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        // URL ini mengambil dari environment variable di docker-compose.yml
        url: process.env.DATABASE_URL,
        autoLoadEntities: true, // Otomatis load entity/model kita
        synchronize: true, // Otomatis membuat tabel (HANYA untuk development)
      }),
    }),

    ProductModule,
  ],
  controllers: [AppController, ProductController],
  providers: [],
})
export class AppModule {}