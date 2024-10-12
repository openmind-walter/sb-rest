import { Module } from '@nestjs/common';
import { RedisMultiService } from './redis.multi.service';

@Module({
  providers: [RedisMultiService],
  exports: [RedisMultiService],
})
export class RedisModule { }
