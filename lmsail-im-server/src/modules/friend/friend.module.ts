import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friend } from "../../entity/friend.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Friend ])
    ],
    controllers: [FriendController],
    providers: [FriendService]
})
export class FriendModule {}
