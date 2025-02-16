export async function checkRateLimit(
  ip: string,
  action: string
): Promise<boolean> {
  const kv = await Deno.openKv();
  const key = [`ratelimit:${action}`, ip];
  const attempts = await kv.get<number>(key);

  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

  if (!attempts.value) {
    await kv.set(key, 1, { expireIn: WINDOW_MS });
    return true;
  }

  if (attempts.value >= MAX_ATTEMPTS) {
    return false;
  }

  await kv.set(key, (attempts.value as number) + 1, { expireIn: WINDOW_MS });
  return true;
}
