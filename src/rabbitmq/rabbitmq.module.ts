// src/rabbitmq/rabbitmq.module.ts
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { RabbitMQConsumer } from './rabbitmq.consumer';
import { ProductModule } from '../product/product.module'; // <-- 1. IMPORT

@Module({
  imports: [
    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
      exchanges: [
        {
          name: 'orders_exchange',
          type: 'topic',
        },
      ],
    }),
    ProductModule, // <-- 2. TAMBAHKAN INI
  ],
  providers: [RabbitMQConsumer],
})
export class RabbitMQConsumerModule {}