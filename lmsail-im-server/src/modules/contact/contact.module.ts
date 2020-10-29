import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contacts } from 'src/entity/contact.model';
import { ContactService } from './contact.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Contacts ])
    ],
    providers: [ContactService] 
})
export class ContactModule {}
