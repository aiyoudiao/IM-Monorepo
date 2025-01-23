import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketServer } from '@nestjs/websockets';
import { Namespace } from 'socket.io';

import { EventBusEvents } from '../../constants/event-bus.constant';
import { CacheService } from '../../shared/redis/cache.service';

import { BroadcastBaseGateway } from '../base.gateway';
import { BusinessEvents } from '../business-event.constant';

export interface AuthGatewayOptions {
  namespace: string;
}

export interface IAuthGateway
  extends OnGatewayConnection,
    BroadcastBaseGateway {}

export function createAuthGateway(
  options: AuthGatewayOptions
): new (...args: any[]) => IAuthGateway {
  const { namespace } = options;

  class AuthGateway extends BroadcastBaseGateway implements IAuthGateway {
    constructor(private readonly cacheService: CacheService) {
      super();
    }

    @WebSocketServer()
    protected namespace: Namespace;

    // 验证失败，直接断开连接
    async authFailed(client: Socket) {
      client.send(
        this.gatewayMessageFormat(BusinessEvents.AUTH_FAILED, '认证失败')
      );
      client.disconnect();
    }

    // 验证 token，并将 socket 与 token 绑定
    async authToken(token: string): Promise<boolean> {
      if (typeof token !== 'string') return false;

      return true;
    }

    // 当客户端连接时触发
    async handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`); // 打印连接的客户端 ID
      // console.log('client connection ', client);
      // const token =
      //   client.handshake.query.token ||
      //   client.handshake.headers.authorization ||
      //   client.handshake.headers.Authorization;
      // if (!token) return this.authFailed(client);

      // if (!(await this.authToken(token as string)))
      //   return this.authFailed(client);

      super.handleConnect(client);

      const sid = client.id;
      this.tokenSocketIdMap.set('test', sid);
    }

    // 断开连接时触发
    handleDisconnect(client: Socket) {
      super.handleDisconnect(client);
    }

    // token 与 socketId 的映射
    tokenSocketIdMap = new Map<string, string>();

    // 监听 token 过期的事件
    @OnEvent(EventBusEvents.TokenExpired)
    handleTokenExpired(token: string) {
      // consola.debug(`token expired: ${token}`)

      const server = this.namespace.server;
      const sid = this.tokenSocketIdMap.get(token);
      if (!sid) return false;

      const socket = server.of(`/${namespace}`).sockets.get(sid);
      if (socket) {
        socket.disconnect();
        super.handleDisconnect(socket);
        return true;
      }
      return false;
    }

    // 广播消息，发送给所有客户端
    override broadcast(event: BusinessEvents, data: any) {
      this.cacheService.emitter
        .of(`/${namespace}`)
        .emit('message', this.gatewayMessageFormat(event, data));
    }
  }

  return AuthGateway;
}
