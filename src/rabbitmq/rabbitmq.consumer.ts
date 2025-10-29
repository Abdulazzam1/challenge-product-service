// src/rabbitmq/rabbitmq.consumer.ts
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RabbitMQConsumer {
  private readonly logger = new Logger(RabbitMQConsumer.name);

  // Dekorator ini menghubungkan kita ke RabbitMQ
  @RabbitSubscribe({
    exchange: 'orders_exchange',    // Exchange dari Fase 0
    routingKey: 'order.created',    // Routing key dari Fase 0
    queue: 'q.products.order_created', // Nama queue (antrian) kita
    queueOptions: {
      durable: true, // Queue akan bertahan jika broker restart
    },
  })
  public async handleOrderCreated(msg: any) {
    // msg: any -> adalah payload JSON yang dikirim Go
    this.logger.log(`=================================================`);
    this.logger.log(`✅ EVENT RECEIVED (order.created)!`);
    this.logger.log(`Payload: ${JSON.stringify(msg)}`);
    this.logger.log(`=================================================`);
  }
}