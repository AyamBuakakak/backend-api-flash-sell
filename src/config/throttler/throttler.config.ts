import { ThrottlerModule } from "@nestjs/throttler";

export const throttlerModule = ThrottlerModule.forRoot([{
    name: 'short',
    ttl: 1000,
    limit: 5,
}, {
    name: 'long',
    ttl: 60000,
    limit: 200,
}
]);