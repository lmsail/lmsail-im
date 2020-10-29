import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../../../config/app.pro';
import { User } from "../../../entity/user.model";
import { Util } from "../../../utils/util";
import { CacheService } from "../../cache/cache.service";

/**
 * 单点登录思路
 * 1、登录：登录成功将用户信息与token写入redis中
 * 2、守卫：取出传入的token与redis中的token比对，不一致则拦截本次请求即退出
 * 使用方式：
 * 将 controller 中原本的 @UseGuards(AuthGuard('jwt')) 换成 @UseGuards(SsoGuard)
 */
@Injectable()
export class SsoGuard implements CanActivate {
    constructor(private readonly cache: CacheService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const { headers: { authorization } } = context.switchToHttp().getRequest();
            const token = authorization.split(' ')[1]; // Bear tokenstr...
            const payload: User = <User> jwt.verify(token, jwtConstants.secret);
            const cacheToken = await this.cache.client.hget('tokens', Util.Md5(payload.username));
            if(cacheToken === token) {
                context.switchToHttp().getRequest().user = payload; // 将解析的 user 信息写入到请求中
                return true;
            }
            return false;
        } catch (e) {
            throw new UnauthorizedException('token验证出错，客户端返回 401');
        }
    }
}
