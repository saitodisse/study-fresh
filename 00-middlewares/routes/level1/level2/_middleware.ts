import { FreshContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: FreshContext) {
  console.log(`[2](_middleware) ${req.method} [${ctx.destination}]: ${req.url} (counter: ${ctx.state.counter})`);
  ctx.state.counter = Number(ctx.state.counter ?? 0) + 1;

  const resp = await ctx.next();
  return resp;
}