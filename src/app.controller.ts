// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // Kita tidak butuh AppService, jadi hapus constructor

  @Get('health') // <- Mengubah route dari / menjadi /health
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}