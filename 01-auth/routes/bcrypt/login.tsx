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

    if (!userResult.value) {
      return _ctx.render!({ message: "Usuário não encontrado!" });
    }

    // Check if email is verified
    if (!userResult.value.verified) {
      return _ctx.render!({
        message: "Por favor, verifique seu email antes de fazer login.",
      });
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
    <>
      <h1 class="text-4xl font-bold text-white">Login</h1>
      {pageProps.data?.message && (
        <p class="mt-4 text-red-400 text-2xl">{pageProps.data.message}</p>
      )}
      <form class="mt-6" method="POST">
        <div>
          <label class="block text-white text-2xl" htmlFor="username">
            Usuário ou Email:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="usuário ou email"
            class="text-2xl mt-2 px-4 py-3 border rounded bg-gray-700 text-white border-gray-600 focus:border-gray-500 focus:ring"
          />
        </div>
        <div class="mt-6">
          <label class="block text-white text-2xl" htmlFor="password">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="****"
            class="text-2xl mt-2 px-4 py-3 border rounded bg-gray-700 text-white border-gray-600 focus:border-gray-500 focus:ring"
          />
        </div>
        <button
          type="submit"
          class="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-2xl"
        >
          Entrar
        </button>
      </form>
      <div class="mt-6 flex justify-between">
        <a
          href="/bcrypt/forgot-password"
          class="text-blue-300 hover:underline text-2xl"
        >
          Esqueceu sua senha?
        </a>
        <a
          href="/bcrypt/signin"
          class="text-blue-300 hover:underline text-2xl"
        >
          Criar nova conta
        </a>
      </div>
      <div id="loading" class="hidden mt-4 text-center text-white text-2xl">
        Autenticando...
      </div>
    </>
  );
}
