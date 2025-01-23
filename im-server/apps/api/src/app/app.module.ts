import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import config from '../config';

import { SocketModule } from '../socket/socket.module';
import { SharedModule } from '../shared/shared.module';
import { AllExceptionsFilter } from '../common/filters/any-exception.filter';
import { TimeoutInterceptor } from '../common/interceptors/timeout.interceptor';
// import { EventsModule } from '../modules/events/events.module';
import { ChatModule } from '../modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    // ChatModule,
    SharedModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new TimeoutInterceptor(15 * 1000),
    },
    AppService,
  ],
})
export class AppModule {}
