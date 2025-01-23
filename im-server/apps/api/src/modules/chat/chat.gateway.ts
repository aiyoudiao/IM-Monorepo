import {
  WebSocketGateway, // WebSocket 网关装饰器
  WebSocketServer, // WebSocket 服务端实例装饰器
  SubscribeMessage, // 用于监听客户端消息
  OnGatewayConnection, // 客户端连接时的生命周期钩子
  OnGatewayDisconnect, // 客户端断开连接时的生命周期钩子
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // 引入 Socket.IO 类型
import { ChatService } from './chat.service'; // 引入聊天服务

@WebSocketGateway({ cors: true }) // 创建 WebSocket 网关，允许跨域
// @WebSocketGateway({
//   cors: {
//     origin: '*', // 允许任意来源
//     methods: ['GET', 'POST'], // 允许的 HTTP 方法
//   },
// })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server; // Socket.IO 服务实例，用于广播消息

  constructor(private readonly chatService: ChatService) {}

  // 当客户端连接时触发
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`); // 打印连接的客户端 ID
  }

  // 当客户端断开连接时触发
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`); // 打印断开的客户端 ID
  }

  // 监听客户端发送的 `joinRoom` 消息
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { room: string; username: string }) {
    const { room, username } = payload;
    client.join(room); // 将客户端加入指定的房间
    this.server.to(room).emit('message', {
      username: 'System',
      message: `${username} has joined the room.`,
    }); // 向房间内广播用户加入的消息
    console.log(`${username} joined room: ${room}`);
  }

  // 监听客户端发送的 `message` 消息
  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    payload: { room: string; username: string; message: string }
  ) {
    const { room, username, message } = payload;
    this.server.to(room).emit('message', { username, message }); // 向房间内广播消息
    console.log(`[${room}] ${username}: ${message}`);
  }

  // 监听客户端发送的 `leaveRoom` 消息
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload: { room: string; username: string }) {
    const { room, username } = payload;
    client.leave(room); // 将客户端从房间中移除
    this.server.to(room).emit('message', {
      username: 'System',
      message: `${username} has left the room.`,
    }); // 向房间内广播用户离开的消息
    console.log(`${username} left room: ${room}`);
  }
}
