import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';

// Import ESM menggunakan ekstensi .js sesuai arsitektur proyek Anda
import { AppModule } from '../src/app.module.js';
import { Product } from '../src/modules/module-catalog/product/entities/product.entity.js';
import { OrderStatus } from '../src/modules/module-catalog/order/entities/order.entity.js';

describe('OrderController - Flash Sale (E2E)', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let productId: string;
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // SANGAT PENTING: Karena OrderController membaca (req as any).user.id,
        // kita menyuntikkan middleware mock untuk mensimulasikan user yang sudah tersertifikasi/login.
        app.use((req: any, _res: any, next: any) => {
            req.user = { id: mockUserId };
            next();
        });

        await app.init();
        dataSource = moduleFixture.get<DataSource>(DataSource);
    });

    beforeEach(async () => {
        // 1. Bersihkan tabel database agar tidak ada efek samping antar test case
        await dataSource.query('TRUNCATE TABLE "orders", "order_items", "products" CASCADE;');

        // 2. Siapkan data produk dummy dengan stok terbatas (2 buah)
        const productRepo = dataSource.getRepository(Product);
        const initialProduct = productRepo.create({
            name: 'Flash Sale Laptop Gaming',
            price: 15000000,
            stock: 2,
        });

        const savedProduct = await productRepo.save(initialProduct);
        productId = savedProduct.id;
    });

    afterAll(async () => {
        // Tutup koneksi agar Vitest tidak menggantung (hanging process)
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
        if (app) {
            await app.close();
        }
    });

    describe('POST /order/flash-sale', () => {
        it('201 Created - Berhasil membuat transaksi flash sale dan mengurangi stok', async () => {
            const response = await request(app.getHttpServer())
                .post('/order/flash-sale')
                .send({
                    productId,
                    quantity: 1,
                })
                .expect(201);

            // Verifikasi respons HTTP dari Controller
            expect(response.body).toHaveProperty('id');
            expect(response.body.status).toBe(OrderStatus.SUCCESS);
            expect(response.body.totalPrice).toBe(15000000);
            expect(response.body.items).toHaveLength(1);
            expect(response.body.items[0].quantity).toBe(1);

            // Verifikasi fisik ke PostgreSQL: Stok harus terpotong dari 2 menjadi 1
            const productInDb = await dataSource
                .getRepository(Product)
                .findOneBy({ id: productId });

            expect(productInDb?.stock).toBe(1);
        });

        it('400 Bad Request - Gagal saat kuantitas pesanan melebihi sisa stok', async () => {
            const response = await request(app.getHttpServer())
                .post('/order/flash-sale')
                .send({
                    productId,
                    quantity: 5, // Mengaitkan pesanan 5 buah saat stok hanya 2
                })
                .expect(400);

            expect(response.body.message).toBe('Mohon maaf, stok tidak mencukupi atau sudah habis!');

            // Verifikasi Rollback di PostgreSQL: Stok harus tetap 2
            const productInDb = await dataSource
                .getRepository(Product)
                .findOneBy({ id: productId });

            expect(productInDb?.stock).toBe(2);
        });

        it('400 Bad Request - Gagal ketika ID produk tidak ada di database', async () => {
            const nonExistentUuid = '00000000-0000-0000-0000-000000000000';

            const response = await request(app.getHttpServer())
                .post('/order/flash-sale')
                .send({
                    productId: nonExistentUuid,
                    quantity: 1,
                })
                .expect(400);

            expect(response.body.message).toBe('Produk tidak ditemukan');
        });
    });
});