import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contacts } from 'src/entity/contact.model';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Contacts ])
    ],
    providers: [ContactService],
    controllers: [ContactController] 
})
export class ContactModule {}
