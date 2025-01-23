export enum BusinessEvents {
  GATEWAY_CONNECT = 'GATEWAY_CONNECT',
  GATEWAY_DISCONNECT = 'GATEWAY_DISCONNECT',

  AUTH_FAILED = 'AUTH_FAILED',

  // 用户上线聊天
  JOIN_ROOM = 'joinRoom',
  MESSAGE = 'message',
  LEAVE_ROOM = 'leaveRoom',
}
