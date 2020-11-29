import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpexceptionFilter } from "./common/httpexception.filter";
import { AppModule } from './app.module';
import { Util } from './utils/util';
import { env } from './config/app.pro';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors(); // 处理前端接口跨域
    app.useGlobalPipes(new ValidationPipe()); // 开启一个全局验证管道
    app.useGlobalFilters(new HttpexceptionFilter()); // 全局过滤器，处理 jwt 验证
    // app.useStaticAssets(join(__dirname, '..', '/public'), { prefix: '/' }); // 配置静态资源文件夹
    app.useStaticAssets('public', { prefix: '/' }); // 配置静态资源文件夹

    // 引入 swagger 生成 Api 文档
    const options = new DocumentBuilder()
        .setTitle(env.title).setDescription(env.apiDesc).setVersion(env.apiVersion).addBearerAuth().build();
    SwaggerModule.setup(env.docsRouter, app, SwaggerModule.createDocument(app, options));

    await app.listen(env.serverPort); Util.ClientLog(env.appUrl, env.docsRouter, env.title);
}
bootstrap();
