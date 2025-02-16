import { encodeBase64 } from "$std/encoding/base64.ts";

export function generateAuthToken(username: string): string {
  const random = crypto.getRandomValues(new Uint8Array(32));
  const timestamp = new Date().getTime();
  return encodeBase64(`${username}:${timestamp}:${random}`);
}
