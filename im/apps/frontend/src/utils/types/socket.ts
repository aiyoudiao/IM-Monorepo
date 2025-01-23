/* @description: user API Interface */
export interface IUser {
  id: number;
  name: string;
  bio?: string;
  email: string;
  avatarUrl: string;
}

export interface UpdateUserDto {
  name?: string;
  bio?: string;
  email?: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SearchUsersDto {
  name: string;
}

// ========================================

/* @description: message API Interface */
export interface IMessage {
  id: number;
  username: IUser;
  room: number;
  content: string;
}

export interface AddMessageDto {
  room: string;
  username: string;
  message: string;
}

// ========================================

/* @description: socket API Interface */
export interface ServerToClientEvents {
  message: (data: IMessage) => void;
  connect: () => void;
  disconnect: () => void;
}

export interface ClientToServerEvents {
  message: (data: AddMessageDto) => void;
  joinRoom: (data: AddMessageDto) => void;
  leaveRoom: (data: AddMessageDto) => void;
}
