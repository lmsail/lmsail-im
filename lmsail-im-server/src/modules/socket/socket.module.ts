import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacts } from 'src/entity/contact.model';
import { Friend } from 'src/entity/friend.model';
import { Message } from 'src/entity/message.model';
import { User } from 'src/entity/user.model';
import { ContactService } from '../contact/contact.service';
import { FriendService } from '../friend/friend.service';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ User, Friend, Contacts, Message ]),
    ],
    providers: [ EventsGateway, UserService, FriendService, ContactService, EventsService, MessageService ]
})
export class SocketModule {}
