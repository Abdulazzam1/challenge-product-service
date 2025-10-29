// src/rabbitmq/rabbitmq.module.ts
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { RabbitMQConsumer } from './rabbitmq.consumer';

@Module({
  imports: [
    // --- PERBAIKAN DI SINI ---
    // Kita hapus argumen "RabbitMQModule," yang pertama
    RabbitMQModule.forRoot({
      // URL ini diambil dari environment variable di docker-compose.yml
      uri: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
      exchanges: [
        {
          // Ini exchange yang kita buat di Go (Fase 0)
          name: 'orders_exchange',
          type: 'topic',
        },
      ],
    }),
    // -------------------------
  ],
  providers: [RabbitMQConsumer],
})
export class RabbitMQConsumerModule {}