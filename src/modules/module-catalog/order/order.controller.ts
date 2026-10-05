import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order.dto.js';
import type { Request } from 'express';
import { FlashSaleService } from './flash-sale.service.js';

@Controller('order')
export class OrderController {
  constructor(
    private readonly flashSaleService: FlashSaleService
  ) { }
  @Post('flash-sale')
  async createFlashSaleOrder(@Body() dto: CreateOrderItemDto, @Req() req: Request) {
    const userId = (req as any).user?.id || '123e4567-e89b-12d3-a456-426614174000';
    return await this.flashSaleService.buyProduct(dto.productId, userId, dto.quantity);
  }
}
