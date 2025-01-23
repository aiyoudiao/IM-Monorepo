import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private rooms: Record<string, Set<string>> = {}; // 用于存储每个房间的用户

  // 添加用户到房间
  addUserToRoom(room: string, username: string) {
    if (!this.rooms[room]) {
      this.rooms[room] = new Set();
    }
    this.rooms[room].add(username); // 将用户名添加到房间
  }

  // 从房间中移除用户
  removeUserFromRoom(room: string, username: string) {
    if (this.rooms[room]) {
      this.rooms[room].delete(username); // 删除用户名
      if (this.rooms[room].size === 0) {
        delete this.rooms[room]; // 如果房间为空，删除该房间
      }
    }
  }

  // 获取房间中的所有用户
  getUsersInRoom(room: string): string[] {
    return this.rooms[room] ? Array.from(this.rooms[room]) : [];
  }
}
