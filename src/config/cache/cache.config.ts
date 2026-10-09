import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from "@nestjs/config";


export const cacheModule = CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
            socket: {
                host: configService.get<string>('REDIS_HOST', 'localhost'),
                port: configService.get<number>('REDIS_PORT', 6379),
            },
        });

        return { store };
    },
})