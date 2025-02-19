import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { Data } from "./model/Data.ts";
import SessionCountdown from "../islands/SessionCountdown.tsx";
import MyIsland from "../islands/MyIsland.tsx";

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);

    console.log("cookies.auth", cookies.auth);
    console.log("cookies.exp", cookies.exp);

    return ctx.render!({
      isAllowed: cookies.auth && cookies.auth !== "",
      session_value: cookies.auth,
      session_exp: cookies.exp,
    });
  },
};

export default function Home({ data, url }: PageProps<Data>) {
  return (
    <div class="px-4 py-8 mx-auto">
      <div className="p-4 bg-gray-800 rounded-xl shadow-lg">
        <div class="max-w-screen-md mx-auto flex flex-col">
          <h1 class="mt-8 text-2xl font-bold text-white">Página Inicial</h1>

          <p
            class={"my-8" +
              (data.isAllowed ? " text-green-400" : " text-red-400")}
          >
            {data.isAllowed
              ? "Você está autenticado!"
              : "Você não está autenticado!"}
          </p>

          {data.isAllowed && data.session_exp && (
            <div class="my-8 flex flex-row justify-start space-x-10 items-baseline">
              <p class="text-white">
                value: {data.session_value}, exp:{" "}
                {new Date(Number(data.session_exp)).toLocaleString()}
              </p>
              <SessionCountdown exp={Number(data.session_exp)} />
              <MyIsland />
            </div>
          )}

          {!data.isAllowed
            ? (
              <div className="space-y-2">
                <div>
                  <a className="underline text-white" href="/bcrypt/login">
                    Login (bcrypt + Deno KV)
                  </a>
                </div>
                <div>
                  <a className="underline text-white" href="/bcrypt/signin">
                    Criar conta (bcrypt + Deno KV)
                  </a>
                </div>
                <div>
                  <a className="underline text-white" href="/db/list-all">
                    Listagens, banco de dados
                  </a>
                </div>
              </div>
            )
            : (
              <a className="underline text-white" href="/bcrypt/logout">
                Logout
              </a>
            )}

          <h1 class="mt-8 mb-4 text-2xl font-bold text-white">Documentação</h1>
          <ul class="space-y-4">
            <li>
              <a
                href="/docs/01-understanding-auth"
                className="underline hover:text-gray-300 text-white"
              >
                Autenticação vs Autorização
              </a>
            </li>
            <li>
              <a
                href="/docs/02-sessions"
                className="underline hover:text-gray-300 text-white"
              >
                Sessões
              </a>
            </li>
            <li>
              <a
                href="/docs/03-cookies"
                className="underline hover:text-gray-300 text-white"
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
