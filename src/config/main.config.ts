import { ConfigModule } from '@nestjs/config'

export const configModule: any = ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env.development',
})