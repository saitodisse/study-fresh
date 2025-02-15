/// <reference lib="deno.unstable" />
import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../api/types/User.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const username = form.get("username")?.toString() || "";
    const password = form.get("password")?.toString() || "";

    if (!username || !password) {
      const searchParams = new URLSearchParams();
      searchParams.set("message", "Usuário e senha são obrigatórios!");
      return Response.redirect(`/signin?${searchParams.toString()}`);
    }

    // Check if user already exists
    const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);
    const userResult = await kv.get<User>(["users", username]);

    if (userResult.value) {
      const searchParams = new URLSearchParams();
      const message =
        "Usuário já cadastrado. Favor escolher outro username ou fazer login.";
      searchParams.set("message", message);
      return Response.redirect(`/signin?${searchParams.toString()}`);
    }

    // Create new user
    const passwordHash = await bcrypt.hash(password);
    const user: User = {
      username,
      password: passwordHash,
      createdAt: new Date(),
    };

    // Save user to database
    const result = await kv.set(["users", username], user);

    if (!result.ok) {
      const searchParams = new URLSearchParams();
      searchParams.set("message", "Erro ao criar usuário. Tente novamente.");
      return Response.redirect(`/signin?${searchParams.toString()}`);
    }

    // Set authentication cookie
    const headers = new Headers();
    setCookie(headers, {
      name: "auth",
      value: "bar",
      path: "/",
      secure: true,
      sameSite: "Lax",
    });

    headers.set("location", "/");
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function SigninPage(props: PageProps) {
  const message = props.url.searchParams.get("message");

  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col">
        <h1 class="text-2xl font-bold">Criar Conta</h1>
        {message && <p class="mt-4 text-red-500">{message}</p>}
        <form class="mt-4" method="POST">
          <div class="mb-4">
            <label class="block" htmlFor="email">Usuário:</label>
            <input
              type="username"
              id="username"
              name="username"
              class="mt-2 px-3 py-2 border rounded w-full"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block" htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              class="mt-2 px-3 py-2 border rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Criar Conta
          </button>
          <a href="/login" class="ml-4 text-blue-500 hover:underline">
            Já tem uma conta? Faça login
          </a>
        </form>
      </div>
    </div>
  );
}
