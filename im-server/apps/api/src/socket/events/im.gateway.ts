import {
  GatewayMetadata,
  WebSocketGateway, // WebSocket 网关装饰器
  WebSocketServer, // WebSocket 服务端实例装饰器
  SubscribeMessage, // 用于监听客户端消息
  OnGatewayConnection, // 客户端连接时的生命周期钩子
  OnGatewayDisconnect, // 客户端断开连接时的生命周期钩子
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io'; // 引入 Socket.IO 类型

import { CacheService } from '../../shared/redis/cache.service';

import { createAuthGateway } from '../shared/auth.gateway';
import { BusinessEvents } from '../business-event.constant';

const AuthGateway = createAuthGateway({ namespace: 'im' });
// @WebSocketGateway<GatewayMetadata>({ namespace: 'im' })
@WebSocketGateway({ namespace: 'im', cors: true })
export class IMEventsGateway
  extends AuthGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly cacheService: CacheService) {
    super(cacheService);
  }

  @WebSocketServer()
  protected _server: Server;

  get server() {
    return this._server;
  }

  // 监听客户端发送的 `joinRoom` 消息
  @SubscribeMessage(BusinessEvents.JOIN_ROOM)
  handleJoinRoom(client: Socket, payload: { room: string; username: string }) {
    console.log('handleJoinRoom ', client.id);
    const { room, username } = payload;
    client.join(room); // 将客户端加入指定的房间
    this.server.to(room).emit('message', {
      username: 'System',
      message: `${username} has joined the room.`,
    }); // 向房间内广播用户加入的消息
    console.log(`${username} joined room: ${room}`);
  }

  // 监听客户端发送的 `message` 消息
  @SubscribeMessage(BusinessEvents.MESSAGE)
  handleMessage(
    client: Socket,
    payload: { room: string; username: string; message: string }
  ) {
    console.log('handleMessage ', client.id);
    const { room, username, message } = payload;
    this.server.to(room).emit('message', { username, message }); // 向房间内广播消息
    console.log(`[${room}] ${username}: ${message}`);
  }

  // 监听客户端发送的 `leaveRoom` 消息
  @SubscribeMessage(BusinessEvents.LEAVE_ROOM)
  handleLeaveRoom(client: Socket, payload: { room: string; username: string }) {
    console.log('handleLeaveRoom ', client.id);
    const { room, username } = payload;
    client.leave(room); // 将客户端从房间中移除
    this.server.to(room).emit('message', {
      username: 'System',
      message: `${username} has left the room.`,
    }); // 向房间内广播用户离开的消息
    console.log(`${username} left room: ${room}`);
  }
}
