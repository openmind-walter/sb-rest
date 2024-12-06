import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import configuration from 'src/configuration';

@Injectable()
export class RedisMultiService implements OnModuleDestroy {
  private clients: { [name: string]: Redis } = {};
  constructor() {
    this.initializeClient(configuration.redis.client.clientFrontEndSub, process.env.REDIS_FE_URL);
    this.initializeClient(configuration.redis.client.clientFrontEnd, process.env.REDIS_FE_URL);
    this.initializeClient(configuration.redis.client.clientFrontEndPub, process.env.REDIS_FE_URL);
    this.initializeClient(configuration.redis.client.clientBackEnd, process.env.REDIS_BE_URL);
    this.initializeClient(configuration.redis.client.clientBackendEndPub, process.env.REDIS_BE_URL);
    // Add more clients as needed
  }

  private initializeClient(clientName: string, url: string) {
    try {
      const client = new Redis(url);
      client.on('error', (err) => {
        console.error(`Redis client ${clientName}  URL:${URL} encountered an error:`, err);
      });
      this.clients[clientName] = client;
    } catch (err) {
      console.error(`Failed to initialize Redis client ${clientName}  URL:${URL}`, err);
    }
  }

  async getFieldFromHashMap(client: string, hashKey: string, fieldKey: string) {
    const redis = this.getClient(client);
    if (redis) {
      const response = await redis.hget(hashKey, fieldKey);
      return (response !== null && response?.trim() !== "") ? JSON.parse(response)?.data : null

    }
  }

  async get(client: string, key: string): Promise<string> {
    const redis = this.getClient(client);
    if (redis)
      return await redis.get(key);
  }

  async set(client: string, key: string, seconds: number, value: string): Promise<string> {
    const redis = this.getClient(client);
    if (redis)
      return await redis.setex(key, seconds, value);
  }


  async del(client: string, key: string): Promise<number> {
    const redis = this.getClient(client);
    return await redis.del(key);
  }

  async publish(client: string, channel: string, message: string): Promise<void> {
    const redis = this.getClient(client);
    if (redis)
      await redis.publish(channel, message);
  }

  async subscribe(client: string, channel: string, handler: (message: string) => void): Promise<void> {
    const redis = this.getClient(client);
    if (redis) {
      await redis.subscribe(channel);
      redis.on('message', (subChannel, message) => {
        if (subChannel === channel) {
          handler(message);
        }
      });
    }
  }
  async getTTL(clientName: string, key: string): Promise<number | null> {
    const redis = this.getClient(clientName);
    if (!redis) return 0;
    return await redis.ttl(key);
  }
  async getKeys(client: string, key: string) {
    const redis = this.getClient(client);
    if (redis) return await redis.keys(`${key}*`);
  }

  private getClient(clientName: string): Redis {
    return this.clients[clientName];
  }

  async hset(client: string, key: string, field: string, value:string) {
    const redis = this.getClient(client);
    if (redis)
      await redis.hset(key, field, value);
  }


  async hGet(client: string, key: string, field: string) {
    const redis = this.getClient(client);
    if (redis) {
      return await redis.hget(key, field);
    }
    return null; 
  }

  async onModuleDestroy() {
    for (const client of Object.values(this.clients)) {
      await client.quit();
    }
  }

}
