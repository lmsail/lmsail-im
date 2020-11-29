import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { UserController } from './user.controller';
import { User } from '../../entity/user.model';
import { UserService } from './user.service';
import {Util} from "../../utils/util";
import { Friend } from 'src/entity/friend.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([ User, Friend ]),
        // MulterModule.register({
        //     storage: diskStorage({
        //         destination: `./public/avatar/${Util.CurrentTime(false)}/`,
        //         filename: (req, file, cb) => cb(null, Util.Md5(file.originalname).substr(0, 10) + '.' + file.originalname.split('.')[1])
        //     }),
        // }), 
    ],
    controllers: [ UserController ],
    providers: [ UserService ]
})
export class UserModule {}
