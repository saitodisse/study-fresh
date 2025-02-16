import { Handlers, PageProps } from "$fresh/server.ts";
import { User } from "../api/types/User.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

interface Data {
  users: User[];
  message?: string;
  checkedUser?: string;
  isPasswordCorrect?: boolean;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const kv = await Deno.openKv();
    const entries = kv.list({ prefix: ["users"] });
    const users: User[] = [];

    for await (const entry of entries) {
      users.push(entry.value as User);
    }

    await kv.close();
    return ctx.render({ users });
  },

  async POST(req, ctx) {
    const form = await req.formData();
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    if (!username || !password) {
      return ctx.render({
        users: [],
        message: "Username e senha são obrigatórios",
      });
    }

    const kv = await Deno.openKv();

    // Busca o usuário
    const userResult = await kv.get<User>(["users", username]);
    const users: User[] = [];
    const entries = kv.list({ prefix: ["users"] });
    for await (const entry of entries) {
      users.push(entry.value as User);
    }

    if (!userResult.value) {
      await kv.close();
      return ctx.render({
        users,
        message: "Usuário não encontrado",
        checkedUser: username,
        isPasswordCorrect: false,
      });
    }

    // Verifica a senha
    const isValid = await bcrypt.compare(password, userResult.value.password);
    await kv.close();

    return ctx.render({
      users,
      checkedUser: username,
      isPasswordCorrect: isValid,
      message: isValid ? "Senha correta!" : "Senha incorreta!",
    });
  },
};

export default function CheckAllKeys({ data }: PageProps<Data>) {
  const { users } = data;

  return (
    <div class="p-4 bg-gray-900 text-white min-h-screen">
      <h1 class="text-2xl font-bold mb-4 text-white">Usuários Cadastrados</h1>

      <form method="POST" class="mb-8 p-4 bg-gray-800 rounded">
        <h2 class="text-lg font-semibold mb-4 text-white">Verificar Senha</h2>
        <div class="flex gap-4 items-end">
          <div>
            <label class="block text-sm mb-1">Username</label>
            <input
              type="text"
              name="username"
              class="px-2 py-1 border rounded bg-gray-700 text-white border-gray-600"
              required
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              class="px-2 py-1 border rounded bg-gray-700 text-white border-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Verificar
          </button>
        </div>
        {data.message && (
          <div
            class={`mt-2 p-2 rounded ${
              data.isPasswordCorrect
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {data.message}
          </div>
        )}
      </form>

      <ul class="space-y-2">
        {users.map((user) => (
          <li key={user.username} class="flex items-center">
            <span class="mr-4">{user.username}</span>
            <a
              href={`/users/delete/${user.username}`}
              class="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
            >
              Excluir
            </a>
          </li>
        ))}
      </ul>

      {users.length === 0 && (
        <p class="text-gray-500 mt-4">Nenhum usuário cadastrado ainda.</p>
      )}
    </div>
  );
}
