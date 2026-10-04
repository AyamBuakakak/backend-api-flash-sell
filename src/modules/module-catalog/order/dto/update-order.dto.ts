import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order.dto.js';

export class UpdateOrderDto extends PartialType(CreateOrderItemDto) { }
