// src/rabbitmq/rabbitmq.module.ts
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, forwardRef } from '@nestjs/common'; // <-- 1. Tambah forwardRef
import { RabbitMQConsumer } from './rabbitmq.consumer';
import { ProductModule } from '../product/product.module';

@Module({
  // 2. HAPUS 'isGlobal: true' (kita pakai forwardRef)
  imports: [
    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
      exchanges: [
        {
          name: 'orders_exchange',
          type: 'topic',
        },
        // Pastikan exchange baru kita ada di sini
        {
          name: 'products_exchange',
          type: 'topic',
        },
      ],
    }),

    // 3. Import ProductModule menggunakan forwardRef
    forwardRef(() => ProductModule),
  ],
  providers: [RabbitMQConsumer],

  // 4. (PENTING) Ekspor RabbitMQModule agar ProductModule bisa menggunakannya
  exports: [RabbitMQModule],
})
export class RabbitMQConsumerModule {}