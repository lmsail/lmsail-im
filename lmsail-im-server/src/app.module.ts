import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from "nestjs-redis";
import { UserModule } from './modules/user/user.module';
import { dbConfig, redisConfig } from './config/app.pro';
import { FriendModule } from './modules/friend/friend.module';
import { AuthModule } from './modules/auth/auth.module';
import { HomeModule } from './modules/home/home.module';
import { SocketModule } from './modules/socket/socket.module';
import { CacheModule } from './modules/cache/cache.module';
import { ContactModule } from './modules/contact/contact.module';
import { CacheService } from "./modules/cache/cache.service";
import { MessageModule } from './modules/message/message.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot(dbConfig),
        RedisModule.register(redisConfig),
        AuthModule,
        UserModule,
        ContactModule,
        FriendModule,
        MessageModule,
        HomeModule,
        SocketModule,
        CacheModule
    ],
    providers: [ CacheService ],
    exports: [ CacheService ], // 导出全局模块
})

export class AppModule {}
