import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway'; // 引入 WebSocket 网关
import { ChatService } from './chat.service'; // 引入聊天服务

@Module({
  providers: [ChatGateway, ChatService], // 注册服务和网关
})
export class ChatModule {}
