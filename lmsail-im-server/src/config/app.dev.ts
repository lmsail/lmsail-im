/**
 * 全局配置, 也可以存储在 env中
 */
export const env = {
    appUrl: 'http://127.0.0.1:8008',
    title: 'LmSail React-im Server Api',
    apiVersion: 'v1.0',
    apiDesc: `
react-im 项目的服务端 Api；注意：除了登录/注册接口，其余接口请求头中必须带上 login 接口中获取的 token，格式：token："token字符串";  \r\n
注意：暂时只对入库字段做了基础校验，如有特殊需求，可在 validata 中添加对应规则，具体规则可学习 ' class-validator ' 库
    `,
    serverPort: '8008',
    docsRouter: 'api-docs'
};

// mysql 配置
export const dbConfig: any = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "react-im-server",
    charset: "utf8mb4",
    autoLoadEntities: true,
    synchronize: true
};

export const redisConfig: any = {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: 0
};

// JWT 密钥
export const jwtConstants = {
    secret: 'react-im-lmsail',
    expiration: '24h'
};
