import { Md5 } from 'ts-md5';
import { env } from '../config/app.pro';

export class Util {

    /**
     * 接口成功返回
     * @param message
     * @param data
     */
    static Success(message: string, data?: any) {
        return { code: 200, message, data };
    }

    /**
     * 接口失败返回
     * @param message
     * @constructor
     */
    static Error(message: string) {
        return { code: 400, message };
    }

    /**
     * 同意返回值，根据 result 自动判定返回参数
     * @param result 
     * @param succMsg 
     * @param errMsg 
     * @param data 
     */
    static _Rs(result: boolean, succMsg: string, errMsg: string, data?: any) {
        return result ? this.Success(succMsg, data) : this.Error(errMsg);
    }

    static Md5(str: string): string {
        return Md5.hashStr(str).toString();
    }

    /**
     * 时间自动补0
     * @param timeNumber
     * @constructor
     */
    private static RepairZero(timeNumber: number): number | string {
        return timeNumber < 10 ? '0' + timeNumber : timeNumber;
    }

    /**
     * 生成用户唯一标识 - 暂定
     * @description 将于下一版本替换用户id
     */
    static CreateUniqueID(): string {
        return (Math.random()*10000000).toString(16).substr(0,4) + Math.random().toString().substr(2, 5);
    }

    /**
     * 获取当前时间
     * @constructor
     */
    static CurrentTime(isHaveHour: boolean = true): string {
        const Dates = new Date( new Date().getTime() );
        const year: number = Dates.getFullYear();
        const month: number | string = this.RepairZero( Dates.getMonth() + 1 );
        const day: number | string = this.RepairZero(Dates.getDate());
        const hour: number | string = this.RepairZero(Dates.getHours());
        const minutes: number | string = this.RepairZero(Dates.getMinutes());
        const second: number | string = this.RepairZero(Dates.getSeconds());
        return isHaveHour ? `${year}-${month}-${day} ${hour}:${minutes}:${second}` : `${year}-${month}-${day}`;
    }

    /**
     * 保存用户的头像文件
     * @param fileName 
     */
    static SaveUserAvatarFile(fileName: string): string {
        const savePath = `/avatar/${this.CurrentTime(false)}/`;
        return env.appUrl + savePath + this.Md5(fileName).substr(0, 10) + '.' + fileName.split('.')[1];
    }

    /**
     * 终端打印服务运行地址log
     * @param appUrl  应用地址
     * @param title   标题
     * @param docPath 接口文档路由地址
     * 字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
     */
    static ClientLog(appUrl: string, docPath: string, title?: string): void {
        console.log(`\x1b[32m------------------ ${title ?? `react-im Server Api`} running address -----------------`);
        console.log(`\x1b[35m[react-im] - running address - Socket example is on: \x1b[34m /example/socket.io.html`);
        console.log(`\x1b[35m[react-im] - running address - Api-docs is running on: \x1b[34m${appUrl}/${docPath}`);
    }
}
