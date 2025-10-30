// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitMQConsumerModule } from './rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 1. ConfigModule (Masih diperlukan untuk DB dan RabbitMQ)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Modul RabbitMQ
    RabbitMQConsumerModule,

    // 3. Modul Cache (Redis)
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      // === PERBAIKAN SINTAKS V5 ADA DI SINI ===
      useFactory: async (configService: ConfigService) => ({
        // 'store' sekarang adalah fungsi
        store: () => redisStore({
          // v5 menggunakan properti 'socket' alih-alih 'url'
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          ttl: 10 * 60, // 10 menit
        }),
      }),
      // ===================================
      inject: [ConfigService],
    }),

    // 4. Modul Database (PostgreSQL)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    ProductModule,
  ],
  controllers: [AppController, ProductController],
  providers: [],
})
export class AppModule {}