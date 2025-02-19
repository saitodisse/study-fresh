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
      <h1 class="text-4xl font-bold text-white">Login</h1>
      {pageProps.data?.message && (
        <p class="mt-4 text-red-400 text-2xl">{pageProps.data.message}</p>
      )}
      <form class="mt-6" method="POST">
        <FormInput
          label="Usuário ou Email:"
          type="text"
          id="username"
          name="username"
          required
        />
        <FormInput
          label="Senha:"
          type="password"
          id="password"
          name="password"
          required
        />
        <SubmitButtonIsland text="Entrar" />
      </form>
      <div class="mt-6 flex justify-between">
        <PrimaryLink href="/bcrypt/forgot-password">
          Esqueceu sua senha?
        </PrimaryLink>
        <PrimaryLink href="/bcrypt/signin">
          Criar nova conta
        </PrimaryLink>
      </div>
    </>
  );
}
