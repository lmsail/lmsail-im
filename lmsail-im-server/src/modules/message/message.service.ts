import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.model';
import { Util } from 'src/utils/util';
import { FindMessageDto } from 'src/validata/message.validata';

@Injectable()
export class MessageService {
    
    constructor(
        @InjectRepository(Message)
        private readonly messageModel: Repository<Message>, // 注入 Message 模型
    ){}

    /**
     * 获取用户聊天记录
     * @param params 
     * @param user_id 
     */
    async getMessageList(params: FindMessageDto, user_id: number): Promise<any> {
        const { friend_id, page } = params
        const result = await this.findMessageList(user_id, friend_id, page);
        return Util._Rs(Boolean(result), '获取成功!!', '获取失败!!', result.reverse());
    }

    /**
     * 添加消息记录
     * @param send_id 
     * @param recv_id 
     * @param message 
     * @param local_message_id 本地消息id
     */
    async insertMessage(send_id: number, recv_id: number, local_message_id: string, message: string, type: string): Promise<any> {
        const result = await this.messageModel.save({ 
            send_id, recv_id, local_message_id, message, type, created_at: Util.CurrentTime() 
        });
        return Util._Rs(Boolean(result), '添加成功!!', '添加失败!!');
    }

    /**
     * 查询用户聊天记录
     * @param id 
     * @param friend_id 
     */
    async findMessageList(id: number, friend_id: number, page: number = 0): Promise<Message[]> {
        const list = await this.messageModel.find({
            where: [
                { send_id: id, recv_id: friend_id },
                { send_id: friend_id, recv_id: id }
            ],
            order: { id: 'DESC' },
            skip: page * 15,
            take: 15
        });
        return list.reverse();
    }

    /**
     * 是否为本人发送的消息
     * @param message_id 
     */
    async isMySelfMessage(message_id: number, user_id: number): Promise<Boolean> {
        const where = typeof message_id === 'number' && !isNaN(message_id) ?
            { send_id: user_id, id: message_id } :
            { send_id: user_id, local_message_id: message_id };
        const result = await this.messageModel.findOne({ where });
        return Boolean(result);
    }

    /**
     * 消息撤回
     * @param data { user_id, friend_id, message_id } 
     */
    async withDrawMessage(data: any, message: string): Promise<any> {
        const { user_id, friend_id, message_id } = data
        const where = typeof message_id === 'number' && !isNaN(message_id) ?
            {id: message_id} : {local_message_id: message_id};
        const delStatus = await this.messageModel.delete(where);
        if(delStatus) {
            const result = await this.messageModel.save({
                send_id: user_id, recv_id: friend_id, message, status: 0, created_at: Util.CurrentTime()
            });
            return Util._Rs(Boolean(result), '撤回成功!!', '撤回失败!!');
        }
        return Util.Error('消息撤回失败');
    }

    /**
     * 图片上传
     * @param file 
     * @param user_id 
     */
    async handleImgUpload(file): Promise<any> {
        if(!file) return Util.Error('文件上传错误!!');
        const filePath = Util.upload(file, 'upload');
        if(!filePath) return Util.Error('图片上传失败!!');
        return Util.Success('图片上传成功!!', filePath);
    }
}
