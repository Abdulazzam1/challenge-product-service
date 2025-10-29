// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitMQConsumerModule } from './rabbitmq/rabbitmq.module'; // <-- 1. IMPORT MODUL BARU

@Module({
  imports: [
    RabbitMQConsumerModule, // <-- 2. TAMBAHKAN MODUL BARU DI SINI
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}