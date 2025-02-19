export interface Session {
  username: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
