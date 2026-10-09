import { Provider } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TransformAndCacheInterceptor } from "../../common/interceptors/transform-cache.interceptor.js";

export const transformAndCacheInterceptor: Provider = {
    provide: APP_INTERCEPTOR,
    useClass: TransformAndCacheInterceptor,
} 