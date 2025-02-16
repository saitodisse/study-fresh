import { Handlers, PageProps } from "$fresh/server.ts";
import { User } from "../api/types/User.ts";

interface Data {
  users: User[];
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
};

export default function CheckAllKeys({ data }: PageProps<Data>) {
  const { users } = data;

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Usuários Cadastrados</h1>

      <ul class="space-y-2">
        {users.map((user) => (
          <li key={user.username} class="flex items-center">
            <span class="mr-4">{user.username}</span>
            <a
              href={`/users/delete/${user.username}`}
              class="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
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
