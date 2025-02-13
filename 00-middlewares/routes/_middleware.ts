import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
  console.log(
    `[0](_middleware) ${req.method} [${ctx.destination}]: ${req.url} (counter: ${ctx.state.counter})`,
  );

  // if (ctx.destination === 'route') {
  //   console.log("(middleware) req", req);
  //   console.log("(middleware) ctx", ctx);
  // }

  // print new line to split calls
  if (req.url.indexOf("styles.css") !== -1) {
    console.log("\n");
  }

  ctx.state.counter = Number(ctx.state.counter ?? 0) + 1;

  const resp = await ctx.next();
  return resp;
}
