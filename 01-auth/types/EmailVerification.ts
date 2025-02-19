export interface EmailVerification {
  username: string;
  email: string;
  token: string;
  expiresAt: Date;
}
