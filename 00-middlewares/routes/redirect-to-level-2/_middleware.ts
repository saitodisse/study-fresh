export function handler(req: Request): Response {
  console.log("[r2](middleware) pathname", req.url);
  return new Response("", {
    status: 307,
    // redirect to a relative path
    headers: { Location: "/level1/level2" },
  });
}
