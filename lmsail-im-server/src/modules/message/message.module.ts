import { Module } from '@nestjs/common';
import { diskStorage } from 'multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.model';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MulterModule } from '@nestjs/platform-express';
import { Util } from 'src/utils/util';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Message ])
    ],

    providers: [MessageService],
    controllers: [MessageController]
})
export class MessageModule {}
