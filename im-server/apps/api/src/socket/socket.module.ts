import { Module, Provider } from '@nestjs/common';

import { IMEventsGateway } from './events/im.gateway';
import { ChatService } from '../modules/chat/chat.service';

const providers: Provider[] = [IMEventsGateway, ChatService];

@Module({
  imports: [],
  providers,
  exports: [...providers],
})
export class SocketModule {}
