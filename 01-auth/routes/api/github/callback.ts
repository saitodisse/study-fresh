import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { User } from "../../model/User.ts";
import { Session } from "../../../types/Session.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response("No code provided", { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: Deno.env.get("GITHUB_CLIENT_ID"),
          client_secret: Deno.env.get("GITHUB_CLIENT_SECRET"),
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user data from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      },
    });

    const githubUser = await userResponse.json();

    // Get user's email
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
      },
    });

    const emails = await emailsResponse.json();
    const primaryEmail = emails.find((email: any) => email.primary)?.email;

    // Create or get user from KV store
    const kv = await Deno.openKv();
    const username = `github_${githubUser.login}`;
    let userResult = await kv.get<User>(["users", username]);

    if (!userResult.value) {
      // Create new user
      const user: User = {
        username,
        email: primaryEmail,
        password: "", // No password for GitHub users
        createdAt: new Date(),
        verified: true, // GitHub users are pre-verified
      };

      await kv.set(["users", username], user);
      //   userResult = { value: user, versionstamp: "" };
    }

    // Create session
    const sessionToken = crypto.randomUUID();
    const expiration_time = new Date(Date.now() + 1000 * 60); // 1 minute

    const session: Session = {
      username,
      token: sessionToken,
      expiresAt: expiration_time,
      createdAt: new Date(),
    };
    await kv.set(["sessions", sessionToken], session);

    // Set cookies
    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: sessionToken,
      path: "/",
      secure: true,
      sameSite: "Lax",
      expires: expiration_time,
    });
    setCookie(headers, {
      name: "exp",
      value: expiration_time.getTime().toString(),
      path: "/",
      secure: true,
      sameSite: "Lax",
      expires: expiration_time,
    });
    setCookie(headers, {
      name: "username",
      value: username,
      path: "/",
      secure: true,
      sameSite: "Lax",
      expires: expiration_time,
    });

    headers.set("location", "/");
    return new Response(null, { status: 302, headers });
  },
};
