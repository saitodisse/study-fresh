/// <reference lib="deno.unstable" />
import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../model/User.ts";

type LoginPageProps = {
  message?: string;
  goto?: string;
};

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const usernameOrEmail = form.get("username")?.toString() || "";
    const password = form.get("password")?.toString() || "";

    if (!usernameOrEmail || !password) {
      return _ctx.render!({
        message: "Usuário/Email e senha são obrigatórios!",
      });
    }

    const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);
    // Primeiro tenta buscar por username
    let userResult = await kv.get<User>(["users", usernameOrEmail]);

    // Se não encontrar, busca todos os usuários e procura pelo email
    if (!userResult.value) {
      const entries = kv.list<User>({ prefix: ["users"] });
      for await (const entry of entries) {
        if (entry.value.email === usernameOrEmail) {
          userResult = entry;
          break;
        }
      }
    }

    const validHash = userResult.value?.password;

    if (!validHash) {
      return _ctx.render!({ message: "Usuário não encontrado!" });
    }

    const isValid = await bcrypt.compare(password, validHash);

    if (!isValid) {
      return _ctx.render!({ message: "Senha inválida!" });
    }

    // Salva o cookie de autenticação
    const headers = new Headers();
    const expiration_time = new Date(Date.now() + 1000 * 60);
    setCookie(headers, {
      name: "auth",
      value: Math.random().toString(36).slice(2),
      path: "/",
      secure: true,
      sameSite: "Lax",
      expires: expiration_time, // 1 minuto
    });
    setCookie(headers, {
      name: "exp",
      value: expiration_time.getTime().toString(),
      path: "/",
      secure: true,
      sameSite: "Lax",
      expires: expiration_time, // 1 minuto
    });

    // Adiciona o tempo de expiração como parâmetro de query
    const redirectUrl = new URL("/", req.url);
    redirectUrl.searchParams.set(
      "expires",
      expiration_time.getTime().toString(),
    );

    headers.set("location", redirectUrl.toString());

    return new Response(null, {
      status: 302, // Código de redirecionamento
      headers,
    });
  },
};

export default function LoginPage(pageProps: PageProps<LoginPageProps>) {
  const url = new URL(pageProps.url);
  if (pageProps.data?.goto) {
    return new Response(null, {
      status: 307,
      headers: { Location: pageProps.data.goto },
    });
  }
  return (
    <div class="px-4 py-8 mx-auto">
      <div className="p-4 bg-gray-800 rounded-xl shadow-lg">
        <div class="max-w-screen-md mx-auto flex flex-col">
          <h1 class="text-2xl font-bold text-white">Login</h1>
          {pageProps.data?.message && (
            <p class="mt-4 text-red-400">{pageProps.data.message}</p>
          )}
          <form class="mt-4" method="POST">
            <div>
              <label class="block text-white" htmlFor="username">
                Usuário ou Email:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Digite seu usuário ou email"
                class="mt-2 px-3 py-2 border rounded bg-gray-700 text-white border-gray-600 focus:border-gray-500 focus:ring"
              />
            </div>
            <div class="mt-4">
              <label class="block text-white" htmlFor="password">
                Senha:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                class="mt-2 px-3 py-2 border rounded bg-gray-700 text-white border-gray-600 focus:border-gray-500 focus:ring"
              />
            </div>
            <button
              type="submit"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
          <div class="mt-4 flex justify-between">
            <a
              href="/bcrypt/forgot-password"
              class="text-blue-300 hover:underline"
            >
              Esqueceu sua senha?
            </a>
            <a
              href="/bcrypt/signin"
              class="text-blue-300 hover:underline"
            >
              Criar nova conta
            </a>
          </div>
          <div id="loading" class="hidden mt-4 text-center text-white">
            Autenticando...
          </div>
        </div>
      </div>
    </div>
  );
}
