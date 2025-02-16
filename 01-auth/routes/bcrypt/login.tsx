/// <reference lib="deno.unstable" />
import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../api/types/User.ts";

type LoginPageProps = {
  message?: string;
  goto?: string;
};

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const username = form.get("username")?.toString() || "";
    const password = form.get("password")?.toString() || "";

    const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);
    const userResult = await kv.get<User>(["users", username]);

    const validHash = userResult.value?.password;

    if (!validHash) {
      const searchParams = new URLSearchParams();
      searchParams.set("message", "Usuário não encontrado!");
      return new Response(null, {
        status: 307,
        headers: { Location: `/bcrypt/signin?${searchParams.toString()}` },
      });
    }

    const isValid = await bcrypt.compare(password, validHash);

    if (!isValid) {
      const searchParams = new URLSearchParams();
      searchParams.set("message", "Senha inválida!");

      return _ctx.render!({ message: "Senha inválida!" });
    }

    // Salva o cookie de autenticação
    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: "bar",
      path: "/",
      secure: true,
      sameSite: "Lax",
      expires: new Date(Date.now() + 1000 * 5), // 5 segundos
      // expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 semana
    });

    // Define o cabeçalho de redirecionamento para a página inicial
    headers.set("location", `/`);

    return new Response(null, {
      status: 302, // Código de redirecionamento
      headers,
    });
  },
};

export default function LoginPage(pageProps: PageProps<LoginPageProps>) {
  const url = new URL(pageProps.url);
  const queryMessage = url.searchParams.get("message")!;

  console.log("data", pageProps.data);
  console.log("state", pageProps.state);

  if (pageProps.data?.goto) {
    return new Response(null, {
      status: 307,
      headers: { Location: pageProps.data.goto },
    });
  }

  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col">
        <h1 class="text-2xl font-bold">Login</h1>

        {queryMessage && <p class="mt-4 text-red-500">{queryMessage}</p>}

        <form class="mt-4" method="POST">
          <div>
            <label class="block" htmlFor="username">Usuário:</label>
            <input
              type="text"
              id="username"
              name="username"
              class="mt-2 px-3 py-2 border rounded bg-slate-700"
            />
          </div>
          <div class="mt-4">
            <label class="block" htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              class="mt-2 px-3 py-2 border rounded bg-slate-700"
            />
          </div>
          <button
            type="submit"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
