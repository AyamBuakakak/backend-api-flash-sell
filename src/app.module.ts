import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './modules/module-catalog/product/product.module.js';
import { OrderModule } from './modules/module-catalog/order/order.module.js';

import { configModule } from './config/main.config.js';
import { typeOrmModule } from './config/typeorm/typeorm.config.js';
import { validationPipe } from './config/pipe/pipe.config.js';
import { throttlerGuard } from './config/throttler/throttler-guard.config.js';
import { throttlerModule } from './config/throttler/throttler.config.js';
import { transformAndCacheInterceptor } from './config/interceptor/interceptor.config.js';
import { cacheModule } from './config/cache/cache.config.js';

@Module({
  imports: [
    configModule,
    typeOrmModule,
    throttlerModule,
    cacheModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    throttlerGuard,
    validationPipe,
    transformAndCacheInterceptor,
  ],
})
export class AppModule { }
