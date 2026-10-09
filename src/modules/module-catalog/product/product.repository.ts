import { Injectable } from "@nestjs/common";
import { Product } from "./entities/product.entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ProductRepository {
    constructor(@InjectRepository(Product) private readonly repository: Repository<Product>) { }

    async getById(id: string) {
        return await this.repository.findOne({
            select: { name: true, stock: true, price: true },
            where: { id },
        })
    }
}