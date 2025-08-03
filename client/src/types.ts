export interface DrawCommand {
  type: string;
  [key: string]: any;
}

export interface User {
  id: string;
  userName: string;
}
