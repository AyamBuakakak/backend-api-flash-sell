import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './modules/module-catalog/product/product.module.js';
import { OrderModule } from './modules/module-catalog/order/order.module.js';

import { configModule } from './config/main.config.js';
import { typeOrmModule } from './config/typeorm/typeorm.config.js';
import { validationPipe } from './config/pipe/pipe.config.js';

@Module({
  imports: [
    configModule,
    typeOrmModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    validationPipe,
  ],
})
export class AppModule { }
