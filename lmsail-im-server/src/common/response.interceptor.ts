import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext, next: CallHandler<any>
    ): import('rxjs').Observable<any> | Promise<import('rxjs').Observable<any>> {
        return next.handle().pipe(map(content => {
                return content.code ? {
                    code: content.code || 400,
                    msg: content.message || null,
                    data: content.data || {}
                } : content;
            }),
        );
    }
}
