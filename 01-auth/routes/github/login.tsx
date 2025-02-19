/// <reference lib="deno.unstable" />
import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../model/User.ts";
import { FormInput } from "../../components/FormInput.tsx";
import { PrimaryLink } from "../../components/PrimaryLink.tsx";
import { Session } from "../../types/Session.ts";
import SubmitButtonIsland from "../../islands/SubmitButtonIsland.tsx";

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

    // Clean expired sessions first
    const sessions = kv.list<Session>({ prefix: ["sessions"] });
    const now = new Date();
    for await (const entry of sessions) {
      if (entry.value.expiresAt < now) {
        await kv.delete(entry.key);
      }
    }

    // Generate session token and expiration
    const sessionToken = Math.random().toString(36).slice(2);
    const expiration_time = new Date(Date.now() + 1000 * 60); // 1 minute

    // Save session in KV store
    const session: Session = {
      username: userResult.value.username,
      token: sessionToken,
      expiresAt: expiration_time,
      createdAt: new Date(),
    };
    await kv.set(["sessions", sessionToken], session);

    // Salva o cookie de autenticação
    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: sessionToken,
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
      <h1 class="text-4xl font-bold text-white">Github Login</h1>
      {pageProps.data?.message && (
        <p class="mt-4 text-red-400 text-2xl">{pageProps.data.message}</p>
      )}
      <div class="mt-8 flex items-center justify-center">
        <span class="px-4 text-gray-400">ou</span>
      </div>
      <div class="mt-6">
        <a
          href="/api/github/auth"
          class="w-full flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            />
          </svg>
          Entrar com GitHub
        </a>
      </div>
    </>
  );
}
