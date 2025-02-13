import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext) {
    console.log("[0](Page handler) ctx.state", ctx.state);
    const resp = await ctx.render();
    return resp;
  },
};

export default function Page(props: PageProps) {
  console.log("[0](Page) props.state", props.state);
  return <h1 class="text-2xl font-bold">{props.url.href}</h1>;
}
