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
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 border-b">Email</th>
              <th class="px-4 py-2 border-b">Nome</th>
              <th class="px-4 py-2 border-b">Hash da Senha</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} class="hover:bg-gray-50">
                <td class="px-4 py-2 border-b">{user.email}</td>
                <td class="px-4 py-2 border-b">{user.name}</td>
                <td class="px-4 py-2 border-b">
                  <code class="text-sm bg-gray-100 p-1 rounded">
                    {user.password}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <p class="text-gray-500 mt-4">Nenhum usuário cadastrado ainda.</p>
      )}
    </div>
  );
}
