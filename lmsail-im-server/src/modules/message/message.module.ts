import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.model';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Message ])
    ],
    providers: [MessageService],
    controllers: [MessageController]
})
export class MessageModule {}
