export interface PasswordReset {
  username: string;
  token: string;
  expiresAt: Date;
}
