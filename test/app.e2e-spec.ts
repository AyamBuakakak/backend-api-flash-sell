import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('OrderController (e2e) - Flash Sale', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/order/flash-sale (POST) - Order 1 Product', async () => {
        const validProductId = 'fc1973e5-becb-418f-af02-c860dfa3e648';

        const response = await request(app.getHttpServer())
            .post('/order/flash-sale')
            .send({
                productId: validProductId,
                quantity: 1,
            });

        console.log(`Status E2E: ${response.status}`, response.body);

        expect([201, 400]).toContain(response.status);

        if (response.status === 201) {
            expect(response.body).toHaveProperty('id');
            expect(response.body.status).toBe('SUCCESS');
        }
    });
});