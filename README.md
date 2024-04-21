# [lmsail-im](http://react-im.lmsail.com/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![lmsail_im](https://img.shields.io/badge/lmsail_im-v1.0-green.svg)](http://react-im.lmsail.com/)

## 🎉 项目介绍
点对点聊天IM应用，前后端分离项目！前端：react；后端：NestJS；群聊后续会加，但是短期内不会，有空的话会把精力放在代码优化上！因为我实在是不想写UI了，懒的连手机端都没适配😄  

## 👀 更新记录 

**2020-11-10**

- 完善了添加好友的流程，改用 socket 通讯，实时推送好友申请消息
- 新增 消息撤回 功能，不限时间！
- 增加新消息音效提醒
- 部分 BUG 修复

**2020-11-12**

- 修复消息撤回的BUG，问题复现：发送消息时发送发是物理插入消息记录，此时无 `message_id`，导致撤回失效

    > 解决方案：本地发送消息时，生成 `local_message_id` 带入服务端存入数据库，物理插入的消息记录通过 `local_message_id` 字段作为标识撤回消息

**2020-11-14**

- 新增消息右键复制功能（可选择部分文字右键复制）
- 新增会话列表移除功能
- 发送消息输入框增加 `shift+enter` 换行支持与消息换行的解析支持 
- 对用户手机号进行 `脱敏处理`，即隐藏手机号中间六位 [服务端层面]
- 部分 BUG 修复

**2020-11-29**

- 新增图片消息，引入 `react-dropzone` 支持拖拽发送图片

**2020-12-13**

- "暴力模式"实现暗黑模式，使用“filter”实现颜色反转以及部分自定义适配

**2021-01-10**

- 重新整合"redux"文件目录（增加了好多文件😨），拆分成多个业务文件，方便业务后续扩展以及减少代码耦合度，美其名曰 -> 解耦
- 消息页引入`react-scroll`插件，方便日后做滚动方面优化的准备
- 优化了消息时间的显示，提高美感😯
- 代码里加入了半成品群聊UI，暂时没时间写了，慢慢填！

## 🌱 前端技术栈

|  库/框架  | 文档地址 | 
| :--: | :-----: | 
|  react   | [react 中文文档（https://react.docschina.org）](https://react.docschina.org)   |
|  antd-design3.x   | [antd-design 文档（https://3x.ant.design/index-cn）](https://3x.ant.design/index-cn)  | 
|  redux   |  [Redux 中文文档（https://www.redux.org.cn）](https://www.redux.org.cn)  | 
|  axios   | [axios 中文文档（http://www.axios-js.com）](http://www.axios-js.com)  | 
|  PubSub   |  [PubSub 文档（https://www.npmjs.com/package/pubsub-js）](https://www.npmjs.com/package/pubsub-js)  | 
|  socketIO   | [socket.io 文档（https://socket.io/docs/v3/index.html）](https://socket.io/docs/v3/index.html)   | 
|  react-scroll   | [react-scroll 文档（https://www.npmjs.com/package/react-scroll）](https://www.npmjs.com/package/react-scroll)   | 

## 🌴 后端技术栈

|  库/框架  | 文档地址 | 
| :--: | :-----: | 
|  NestJS   |    [NestJS 中文文档（https://www.itying.com/nestjs）](https://www.itying.com/nestjs)    |
|  redis   |    [nestjs-redis 文档（https://www.npmjs.com/package/nestjs-redis）](https://www.npmjs.com/package/nestjs-redis)    | 
|  JWT   |    [nestjs-redis 文档（https://www.npmjs.com/package/@nestjs/jwt）](https://www.npmjs.com/package/@nestjs/jwt)    | 
|  typeorm   |    [typeorm 中文文档（https://www.bookstack.cn/read/TypeORM-0.2.20-zh/README.md）](https://www.bookstack.cn/read/TypeORM-0.2.20-zh/README.md)    | 
|  socketIO   |    [socket.io 文档（https://socket.io/docs/v3/index.html）](https://socket.io/docs/v3/index.html)    | 
|  swagger   |    [swagger 文档（https://www.npmjs.com/package/@nestjs/swagger）](https://www.npmjs.com/package/@nestjs/swagger)    | 


## 💧 开源协议 

`lmsail-im` 遵循 `MIT` 开源协议.
