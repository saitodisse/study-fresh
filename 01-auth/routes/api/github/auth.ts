import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, _ctx) {
    const clientId = Deno.env.get("GITHUB_CLIENT_ID")!;
    const redirectUri = new URL("/api/github/callback", req.url).toString();

    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.set("client_id", clientId);
    githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
    githubAuthUrl.searchParams.set("scope", "user:email");

    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl.toString(),
      },
    });
  },
};
