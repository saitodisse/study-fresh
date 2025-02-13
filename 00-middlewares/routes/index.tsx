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
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to {props.url.href}</h1>
      </div>
    </div>
  );
}
