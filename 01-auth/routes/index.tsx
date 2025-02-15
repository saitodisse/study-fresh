import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { Login } from "../components/Login.tsx";

interface Data {
  isAllowed: boolean;
}

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    return ctx.render!({ isAllowed: cookies.auth === "bar" });
  },
};

export default function Home({ data, url }: PageProps<Data>) {
  const urlComponent = new URL(url);
  const queryMessage = urlComponent.searchParams.get("message")!;
  const password_hash = urlComponent.searchParams.get("password_hash")!;

  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col">
        <h1 class="mt-8 text-2xl font-bold">Cookies</h1>

        {queryMessage && <p class="mt-4 text-red-500">{queryMessage}</p>}

        <p class="mt-4">
          {data.isAllowed
            ? "Você está autenticado!"
            : "Você não está autenticado!"}
        </p>
        {!data.isAllowed
          ? (
            <>
              <a className="underline" href="/bcrypt/login">
                Login (bcrypt + Deno KV)
              </a>
            </>
          )
          : <a href="/api/logout">Logout</a>}

        <h1 class="mt-8 mb-4 text-2xl font-bold">Documentação</h1>
        <ul class="space-y-4">
          <li>
            <a
              href="/docs/01-understanding-auth"
              className="underline hover:text-gray-300"
            >
              Autenticação vs Autorização
            </a>
          </li>
          <li>
            <a
              href="/docs/02-sessions"
              className="underline hover:text-gray-300"
            >
              Sessões
            </a>
          </li>
          <li>
            <a
              href="/docs/03-cookies"
              className="underline hover:text-gray-300"
            >
              Cookies
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
