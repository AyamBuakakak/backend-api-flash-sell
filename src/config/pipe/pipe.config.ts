import { Provider, ValidationPipe } from "@nestjs/common"
import { APP_PIPE } from "@nestjs/core"

export const validationPipe: Provider = {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }),
}