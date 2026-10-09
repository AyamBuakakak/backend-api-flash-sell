import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity.js';
import { ProductRepository } from './product.repository.js';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) { }

    async getById(id: string): Promise<Product | null> {
        return await this.productRepository.getById(id);
    }
}
