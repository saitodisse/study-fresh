import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { Data } from "./model/Data.ts";
import SessionCountdownIsland from "../islands/SessionCountdownIsland.tsx";
import MyCounterIsland from "../islands/MyCounterIsland.tsx";

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);
    return ctx.render!({
      isAllowed: cookies.auth && cookies.auth !== "",
      session_value: cookies.auth,
      session_exp: cookies.exp,
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
  return (
    <div class="px-8 py-8 mx-auto">
      <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl">
        <div class="max-w-screen-md mx-auto flex flex-col">
          <h1 class="mt-8 text-5xl font-bold text-white">Página Inicial</h1>
          <p
            class={"my-8 " +
              (data.isAllowed ? "text-green-400" : "text-red-400") +
              " text-2xl"}
          >
            {data.isAllowed
              ? "Você está autenticado!"
              : "Você não está autenticado!"}
          </p>
          {data.isAllowed && data.session_exp && (
            <div class="font-mono text-white my-8 flex flex-col items-start text-left space-y-4">
              <p>
                sessão: {data.session_value}
              </p>
              <p>
                expira em: {new Date(Number(data.session_exp)).toLocaleString()}
              </p>
              <SessionCountdownIsland exp={Number(data.session_exp)} />
              <MyCounterIsland />
              <a
                className="underline text-blue-300 text-2xl"
                href="/db/list-all"
              >
                Listagens, banco de dados
              </a>
            </div>
          )}
          {!data.isAllowed
            ? (
              <div className="flex flex-col space-y-6">
                <h1 class="mt-32 mb-1 text-2xl font-bold text-white">
                  bcrypt
                </h1>

                <a
                  className="underline text-blue-300 text-2xl"
                  href="/bcrypt/login"
                >
                  Login (bcrypt + Deno KV)
                </a>
                <a
                  className="underline text-blue-300 text-2xl"
                  href="/bcrypt/signin"
                >
                  Criar conta (bcrypt + Deno KV)
                </a>
              </div>
            )
            : (
              <a
                className="underline text-yellow-300 text-2xl"
                href="/bcrypt/logout"
              >
                Logout
              </a>
            )}
          <h1 class="mt-32 mb-1 text-base font-bold text-white">explicações</h1>
          <ul class="space-y-1">
            <li>
              <a
                href="/docs/01-understanding-auth"
                className="underline hover:text-gray-300 "
              >
                Autenticação vs Autorização
              </a>
            </li>
            <li>
              <a
                href="/docs/02-sessions"
                className="underline hover:text-gray-300 "
              >
                Sessões
              </a>
            </li>
            <li>
              <a
                href="/docs/03-cookies"
                className="underline hover:text-gray-300 "
              >
                Cookies
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
