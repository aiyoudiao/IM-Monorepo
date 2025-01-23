import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [
    // http
    HttpModule,
    // redis
    RedisModule,
  ],
  exports: [HttpModule, RedisModule],
})
export class SharedModule {}
