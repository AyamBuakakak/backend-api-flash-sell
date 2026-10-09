import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service.js';
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get(':id')
    async get(@Param('id') id: string) {
        return await this.productService.getById(id);
    }

}
