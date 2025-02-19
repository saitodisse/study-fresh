/// <reference lib="deno.unstable" />
import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../model/User.ts";
import {
  BUTTON_CLASSES,
  INPUT_CLASSES,
  LINK_CLASSES,
} from "../../utils/styles.ts";
import { FormInput } from "../../components/FormInput.tsx";
import { PrimaryButton } from "../../components/PrimaryButton.tsx";
import { PrimaryLink } from "../../components/PrimaryLink.tsx";

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
        <PrimaryButton type="submit">Entrar</PrimaryButton>
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
