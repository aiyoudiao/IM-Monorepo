import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  AddMessageDto,
} from "../types/socket";

const REACT_APP_API_SOCKET_URL = "http://localhost:3001/im";

class SocketService {
  private readonly socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(REACT_APP_API_SOCKET_URL, {
      transports: ["websocket", "polling"], // 确保使用 WebSocket 传输
      reconnection: true, // 自动重连
      reconnectionAttempts: 5, // 最大重连尝试次数
      secure: true,
    });

  // 连接时传递认证令牌
  connectWithAuthToken(token: string) {
    this.socket.auth = { token };
    this.socket.connect();
  }

  // 断开连接
  disconnect() {
    this.socket.disconnect();
  }

  // 发送消息
  sendMessage(data: AddMessageDto) {
    this.socket.emit("message", data);
  }

  // 订阅连接的事件
  subscribeConnect(messageHandler: ServerToClientEvents["connect"]) {
    this.socket.on("connect", messageHandler);
  }

  // 订阅断开连接的事件
  subscribeDisConnect(messageHandler: ServerToClientEvents["disconnect"]) {
    this.socket.on("disconnect", messageHandler);
  }

  // 订阅消息事件

  subscribeToMessages(messageHandler: ServerToClientEvents["message"]) {
    this.socket.on("message", messageHandler);
  }

  // 加入房间
  joinRoom(data: any) {
    this.socket.emit("joinRoom", data);
  }

  // 离开房间
  leaveRoom(data: any) {
    this.socket.emit("leaveRoom", data);
  }
}

export const socketService = new SocketService();
