import { Controller, Get } from '@nestjs/common';
import { env } from '../../config/app.pro';
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller()
export class HomeController {
    @Get()
    @ApiOperation({ summary: '首页，无实际作用，只做展示用；浏览器直接访问：http://domain:prot' })
    index() {
        return `
            <meta charset="UTF-8">
            <title>${env.title}</title>
            <section style="padding: 50px">
                <img src="https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg" style="width: 200px" alt="NestJS">
                <h1 style="font-size: 40px">${env.title}</h1>
                <h1>react-im 是基于 react、antd、redux 开发的高颜值、点对点的 IM 即时通讯工具！</h1>
                <h3>当前版本：<span style="color: #027fff">${env.apiVersion}</span> · Powered by NestJS · <a style="color: #027fff;text-decoration: none;" href="https://github.com/lmsail">@M先生</a></h3>
                <h3>[宝剑锋从磨砺出，梅花香自苦寒来]</h3>
                <div style="margin-top: 30px">项目主页：<a href=http://localhost:${env.serverPort} style="color: #027fff;text-decoration: none;">http://localhost:${env.serverPort}</a></div>
                <div>接口文档：<a href=http://localhost:${env.serverPort}/${env.docsRouter} style="color: #027fff;text-decoration: none;">http://localhost:${env.serverPort}/${env.docsRouter}</a></div>
            </section>
        `;
    }
}
