import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

interface Data {
  isAllowed: boolean;
  session_value: string;
  session_exp: string;
}

export const handler: Handlers = {
  GET(req, ctx) {
    const cookies = getCookies(req.headers);

    console.log(cookies.auth);

    return ctx.render!({
      isAllowed: cookies.auth && cookies.auth !== "",
      session_value: cookies.value,
      session_exp: cookies.exp,
    });
  },
};

export default function Home({ data, url }: PageProps<Data>) {
  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col">
        <h1 class="mt-8 text-2xl font-bold">Página Inicial</h1>

        <p
          class={"my-8" +
            (data.isAllowed ? " text-green-500" : " text-red-500")}
        >
          {data.isAllowed
            ? "Você está autenticado!"
            : "Você não está autenticado!"}
        </p>

        {data.session_value && (
          <p class="my-8">
            value: {data.session_value}
            <br />
            exp: {data.session_exp}
          </p>
        )}

        {!data.isAllowed
          ? (
            <div className="space-y-2">
              <div>
                <a className="underline" href="/bcrypt/login">
                  Login (bcrypt + Deno KV)
                </a>
              </div>
              <div>
                <a className="underline" href="/bcrypt/signin">
                  Criar conta (bcrypt + Deno KV)
                </a>
              </div>
              <div>
                <a className="underline" href="/users/all-users">
                  Listar usuários
                </a>
              </div>
            </div>
          )
          : <a className="underline" href="/api/logout">Logout</a>}

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
