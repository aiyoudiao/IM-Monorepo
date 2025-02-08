export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: "text" | "image";
}

export interface Language {
  code: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}
