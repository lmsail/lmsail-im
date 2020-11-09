import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.model';
import { Util } from '../../utils/util';
import { env } from '../../config/app.pro';
import { CacheService } from "../cache/cache.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userModel: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly cache: CacheService
    ) {}

    /**
     * 登录返回用户信息与token
     * @param user {username: '', password: ''}
     * return json {code: 200|400, message: '', data: {}}
     */
    async login(user: any): Promise<any> {
        const { username, password } = user;
        const userInfo = await this.userModel.findOne({ username, password: Util.Md5(password) });
        if(userInfo) {
            const token = this.jwtService.sign({ id: userInfo.id, username, nickname: userInfo.nickname });
            this.delCacheOldToken(username, token);
            return Util.Success('登录成功', { token });
        }
        return  Util.Error('账号/密码错误');
    }

    /**
     * 用户注册
     * @param user
     */
    async register(user: any): Promise<any> {
        const { username, nickname, password } = user;
        const isRepeat = await this.userModel.findOne({ username });
        if(isRepeat) return Util.Error('用户名已存在!!');
        const result = await this.userModel.save({
            username, nickname,
            unique_id: Util.CreateUniqueID(),
            avatar: `${env.appUrl}/default/default-${Math.floor(Math.random() * 5) + 1}.png`,
            password: Util.Md5(password),
            created_at: Util.CurrentTime()
        });
        return Util._Rs(Boolean(result), '账号注册成功!!', '账号注册失败!!');
    }

    /**
     * 退出登录
     * @param req
     */
    async logout(req: any): Promise<any> {
        const { user: { username } } = req;
        const result = await this.delCacheOldToken(username);
        return Util._Rs(Boolean(result), '账号退出成功!!', '账号退出失败!!');
    }

    /**
     * 移除用户旧的token
     * @param username
     * @param newToken
     */
    async delCacheOldToken(username: string, newToken?: string): Promise<boolean> {
        const userTokenKey = Util.Md5(username);
        const token = await this.cache.client.hget('tokens', userTokenKey);
        if (newToken) { // 登录时记录新的 token, 直接覆盖，[debug?]未加入过期时间
            return this.cache.client.hset('tokens', userTokenKey, newToken);
        }
        if (token) {
            return this.cache.client.hdel('tokens', userTokenKey);
        }
        return false;
    }
}
