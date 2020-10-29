import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpexceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionRes: any = exception.getResponse();
        const message = status === 401 ? '身份过期，请重新登录' :
            (status === 403 ? '您的账号在其他地方登录，请重新登录！' : exceptionRes.message);
        response.status(200).json({ code: status, message });
    }
}
