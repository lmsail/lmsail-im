import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class CacheService {

    public client;

    constructor(private redisService: RedisService) {
        this.getClient();
    }

    async getClient() {
        this.client = await this.redisService.getClient();
    }
}
