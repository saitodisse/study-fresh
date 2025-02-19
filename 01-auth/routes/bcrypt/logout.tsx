import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const headers = new Headers();
    const pastDate = new Date(0); // Epoch time to expire cookies

    // Clear "auth" cookie
    setCookie(headers, {
      name: "auth",
      value: "",
      path: "/",
      expires: pastDate,
    });

    // Clear "exp" cookie
    setCookie(headers, {
      name: "exp",
      value: "",
      path: "/",
      expires: pastDate,
    });

    // Redirect to login page
    headers.set("location", "/bcrypt/login");
    return new Response(null, { status: 302, headers });
  },
};

// ...existing code if needed...
