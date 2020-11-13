import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacts } from 'src/entity/contact.model';
import { Util } from 'src/utils/util';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contacts)
        private readonly contactModel: Repository<Contacts>, // 注入 Contacts 模型
    ) {}

    /**
     * 移除指定的会话窗口
     * @param friend_id 
     * @param user_id 
     */
    async removeContactItem(friend_id: number, user_id: number): Promise<any> {
        const result = await this.contactModel.delete({ user_id, friend_id });
        return Util._Rs(Boolean(result), '移除成功!!', '移除失败!!');
    }

    /**
     * 查询历史会话记录
     * @param uid 
     */
    async findSessionList(uid: number): Promise<any> {
        return await this.contactModel.query(`
            SELECT 
                c.*, u.nickname, u.avatar, u.area, u.autograph, f.nick_remark,
                IF(u.mobile, CONCAT(LEFT(u.mobile, 3), '******', RIGHT(u.mobile, 2)), '') as mobile
            FROM 
                im_contacts c 
            LEFT JOIN 
                im_users u ON c.friend_id = u.id 
            LEFT JOIN 
                im_friends f ON f.user_id = c.user_id AND f.friend_id = c.friend_id 
            WHERE 
                c.user_id = ${uid} ORDER BY c.created_at DESC
        `);
    }

    /**
     * 清空未读数
     * @param id 
     * @param friend_id 
     */
    async removeUnreadNum(id: number, friend_id: number): Promise<boolean> {
        const result = await this.contactModel.createQueryBuilder()
            .update(Contacts)
            .set({ unread_num: 0 })
            .where('user_id = :id AND friend_id = :friend_id', { id, friend_id })
            .execute();
        return Boolean(result);
    }

    /**
     * 添加正向记录 => 针对自己
     * @param uid 
     * @param friend_id 
     * @param message 
     */
    async addForwardContactRecord(uid: number, friend_id: number, message: string): Promise<boolean> {
        const forwardInfo = await this.contactModel.findOne({ where: [
            { user_id: uid, friend_id }
        ] });
        return !forwardInfo ? Boolean(await this.contactModel.save({ 
            user_id: uid, friend_id, last_mess: message, status: 1, created_at: Util.CurrentTime() 
        })) : Boolean(await this.contactModel.save({ id: forwardInfo.id, last_mess: message, created_at: Util.CurrentTime() }));
    }

    /**
     * 添加反向记录 => 针对对方
     * @param uid 
     * @param friend_id 
     * @param message 
     */
    async addReverseContactRecord(uid: number, friend_id: number, message: string): Promise<boolean> {
        const reverseInfo = await this.contactModel.findOne({ where: [
            { user_id: friend_id, friend_id: uid }
        ] });
        return !reverseInfo ? Boolean(await this.contactModel.save({ 
            user_id: friend_id, friend_id: uid, last_mess: message, unread_num: 1, created_at: Util.CurrentTime() 
        })) : Boolean(await this.contactModel.query(`
            UPDATE im_contacts SET unread_num = \`unread_num\` + 1, last_mess = '${message}', created_at = '${Util.CurrentTime()}' WHERE id = ${reverseInfo.id}
        `));
    }
}