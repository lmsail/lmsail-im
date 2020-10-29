import { createParamDecorator } from '@nestjs/common';

/**
 * 自定义装饰器的方式获取当前请求中的用户信息
 * eg: @CurrentUser() user 结果即：{ id: 1, username: 'lmsail' }
 */
export const CurrentUser = createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user && user.data : user;
});

