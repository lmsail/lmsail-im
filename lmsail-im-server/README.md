# 🎉 v1 版本开发完成啦！2020-10-28 21:32

## lmsail-im-server
> lmsail-im服务端代码，基于 NestJS + typeorm(mysql) + swagger 开发，拥有完整的Api文档，感受一下 `TypeScript` 的魅力 🚀 😄   
> 同样的，这个项目也可以作为你学习 NestJS 的敲门砖，工作中能用到的知识点，项目里基本都有涉及！  
> 项目中的主要涉及到的点：swagger，typeorm，socket，redis，JWT！  

> 日常闲聊可以到这里：[lmsail社区 - 每一次的努力都是看得见的进步！](http://www.lmsail.com)
> 开发版本请持续关注：[lmsail-im-client 开发版本仓库](https://github.com/lmsail/react-im) | [lmsail-im-server 开发版本仓库](https://github.com/lmsail/react-im-server)

## 预览

![接口文档预览](http://www.lmsail.com/storage/c042984fa3ec2bd6b73b44b6b94984fd.png)

## 功能目录

> 已经完成了大部分 Api，基本满足日常需求；其中好友模块，用户模块，登录注册拥有完整的 Api 文档；更具有详细且友好的代码注释！

- 登录、注册（ JWT ）
    - [x] 登录 / 单点登录
    - [x] 注册
    - [x] 退出

- 用户模块
    - [x] 获取用户信息
    - [x] 修改用户昵称
    - [x] 修改用户密码
    - [x] 修改用户头像

- 好友模块
    - [x] 获取通讯录列表
    - [x] 获取好友申请列表
    - [x] 通过/拒绝好友请求
    - [x] 添加好友
    - [x] 修改好友备注
    
- 消息模块
    - [x] 添加 socket 支持
    - [x] 添加 socket token 验证
    - [x] 私聊发消息

## 安装及运行

```
git clone https://github.com/lmsail/lmsail-im
导入根目录中 `react_server-im.sql` 数据库
cd lmsail-server
yarn install or npm i
# 修改 `src/config/app.pro.ts` 中 env 配置项的 `appUrl`、`serverPort` 与 dbConfig 数据库配置项，参考 `app.dev.ts`
yarn start:dev
```
