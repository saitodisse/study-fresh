export function handler(req: Request): Response {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log("[redirect-to-level-1](middleware) pathname", pathname);

  return Response.redirect(url.origin + "/level1", 307);
}
