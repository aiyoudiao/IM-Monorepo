/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import type { ConfigKeyPaths } from './config';

import path from 'node:path';
import cluster from 'node:cluster';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import * as socketio from 'socket.io';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

import { fastifyApp } from './common/adapters/fastify.adapter';
import { RedisIoAdapter } from './common/adapters/socket.adapter';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { AppModule } from './app/app.module';
import { isMainProcess } from './common/global/env';

// 初始化 socket.io-admin-ui
const initSocketIoAdminUI = (app) => {
  // 创建一个 Socket.IO 实例
  const server: Server = app.getHttpServer();
  const io: SocketIOServer = new socketio.Server(server, {
    cors: {
      origin: '*', // 配置允许跨域请求
      methods: ['GET', 'POST'],
    },
    path: '/im/socket.io', // 配置 Socket.IO 的路径
  });

  // 集成 socket.io-admin-ui
  instrument(io, {
    auth: {
      type: 'basic', // 使用基本认证
      username: 'admin',
      password: 'admin', // 设置管理界面的用户名和密码
    },
    namespaceName: '/im',
  });
};

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      bufferLogs: true,
      snapshot: true,

      // forceCloseConnections: true,
    }
  );

  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port = 3000, globalPrefix = 'api' } = configService.get('app', {
    infer: true,
  });

  app.enableCors({ origin: '*', credentials: true });
  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets({ root: path.join(__dirname, '..', 'public') });
  app.enableShutdownHooks();

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useWebSocketAdapter(new RedisIoAdapter(app));

  initSocketIoAdminUI(app);

  await app.listen(port, '0.0.0.0', async () => {
    const url = await app.getUrl();
    const { pid } = process;
    const env = cluster.isPrimary;
    const prefix = env ? '[Primary]' : '[Worker]';

    if (!isMainProcess) return;

    const logger = new Logger('IM NestApplication');
    logger.log(
      `🚀 ${prefix}->${pid} Application is running on: ${url}/${globalPrefix}`
    );
  });
}

bootstrap();
