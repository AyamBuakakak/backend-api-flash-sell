// flash-sale.service.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FlashSaleService } from './flash-sale.service.js';
import { Product } from '../product/entities/product.entity.js';
import { Order } from './entities/order.entity.js';

describe('FlashSaleService (Vitest)', () => {
    let service: FlashSaleService;
    let dataSource: DataSource;

    const mockQueryRunner = {
        connect: vi.fn(),
        startTransaction: vi.fn(),
        commitTransaction: vi.fn(),
        rollbackTransaction: vi.fn(),
        release: vi.fn(),
        manager: {
            findOne: vi.fn(),
            save: vi.fn(),
            create: vi.fn(),
        },
    };

    const mockDataSource = {
        createQueryRunner: vi.fn().mockReturnValue(mockQueryRunner),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FlashSaleService,
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<FlashSaleService>(FlashSaleService);
        dataSource = module.get<DataSource>(DataSource);

        vi.clearAllMocks();
    });

    it('must be defined', () => {
        expect(service).toBeDefined();
    });

    describe('buyProduct', () => {
        const productId = 'product-uuid-123';
        const userId = 'user-uuid-456';

        const mockProduct = {
            id: productId,
            name: 'Flash Sale Laptop',
            stock: 10,
            price: 10000000,
        } as Product;

        const mockOrder = {
            id: 'order-uuid-789',
            userId,
            totalPrice: 10000000,
            status: "SUCCESS",
            items: [],
        } as unknown as Order;

        it('must be succes to buy, commit transaction, and release connection', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue({ ...mockProduct });
            mockQueryRunner.manager.create.mockImplementation((_entity, dto) => dto);
            mockQueryRunner.manager.save.mockImplementation(async (entity) => {
                if (entity.userId) {
                    return mockOrder;
                }
                return entity;
            });

            const result = await service.buyProduct(productId, userId, 1);

            expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
            expect(mockQueryRunner.connect).toHaveBeenCalledTimes(1);
            expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);

            expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Product, {
                where: { id: productId },
                lock: { mode: 'pessimistic_write' },
            });

            expect(mockQueryRunner.manager.save).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    stock: 9,
                }),
            );

            expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
            expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockOrder);
        });

        it('throw BadRequestException and rollback if product was not founded', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue(null);

            await expect(service.buyProduct(productId, userId, 1)).rejects.toThrow(
                new BadRequestException('product not found'),
            );

            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
            expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
        });

        it('throw BadRequestException and rollback if out of stock', async () => {
            const lowStockProduct = { ...mockProduct, stock: 1 };
            mockQueryRunner.manager.findOne.mockResolvedValue(lowStockProduct);

            await expect(service.buyProduct(productId, userId, 5)).rejects.toThrow(
                new BadRequestException('out of stock!'),
            );

            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
            expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
        });

        it('rollback dan release connection if internal error in database', async () => {
            mockQueryRunner.manager.findOne.mockResolvedValue({ ...mockProduct });
            mockQueryRunner.manager.save.mockRejectedValue(
                new Error('Database disk error'),
            );

            await expect(service.buyProduct(productId, userId, 1)).rejects.toThrow(
                'Database disk error',
            );

            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
            expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
        });
    });
});