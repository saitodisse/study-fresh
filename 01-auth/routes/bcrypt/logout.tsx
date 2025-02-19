import { Handlers } from "$fresh/server.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { Session } from "../../types/Session.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const cookies = getCookies(req.headers);
    const sessionToken = cookies.auth;

    const headers = new Headers();
    const pastDate = new Date(0);

    // Remove session from KV store if exists
    if (sessionToken) {
      const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);

      // Remove current session
      await kv.delete(["sessions", sessionToken]);

      // Clean expired sessions
      const sessions = kv.list<Session>({ prefix: ["sessions"] });
      const now = new Date();
      for await (const entry of sessions) {
        if (entry.value.expiresAt < now) {
          await kv.delete(entry.key);
        }
      }
    }

    // Clear cookies
    deleteCookie(headers, "username");
    deleteCookie(headers, "auth");
    deleteCookie(headers, "exp");

    headers.set("location", "/bcrypt/login");
    return new Response(null, { status: 302, headers });
  },
};
