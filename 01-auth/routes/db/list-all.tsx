import { Handlers, PageProps } from "$fresh/server.ts";
import { PasswordReset } from "../../types/PasswordReset.tsx";
import { User } from "../api/types/User.ts";

interface HandlerData {
  users: User[];
  password_reset_list: PasswordReset[];
  message?: string;
  checkedUser?: string;
  isPasswordCorrect?: boolean;
}

export const handler: Handlers<HandlerData> = {
  async GET(req, ctx) {
    const kv = await Deno.openKv();
    const entries = kv.list({ prefix: ["users"] });
    const users: User[] = [];

    for await (const entry of entries) {
      users.push(entry.value as User);
    }

    // password_reset
    const password_reset_items = kv.list({ prefix: ["password_reset"] });
    const password_reset_list: PasswordReset[] = [];

    for await (const entry of password_reset_items) {
      console.log("entry", entry);
      password_reset_list.push(entry.value as PasswordReset);
    }

    await kv.close();
    return ctx.render({ users, password_reset_list });
  },
};

export default function ListAll({ data }: PageProps<HandlerData>) {
  const { users, password_reset_list } = data;

  return (
    <div className="block">
      <div class="p-4 bg-gray-900 text-white">
        <h1 class="text-2xl font-bold mb-4 text-white">Usuários</h1>

        <ul class="space-y-2">
          {users.map((user) => (
            <li key={user.username} class="flex items-center">
              <span class="mr-4">{user.username}</span>
              <a
                href={`/db/delete?itemPath=users,${user.username}`}
                class="bg-red-900 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
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

      <div class="p-4 bg-gray-900 text-white">
        <h1 class="text-2xl font-bold mb-4 text-white">
          Password Reset Tokens
        </h1>

        <ul class="space-y-2">
          {password_reset_list.map((passwordReset) => {
            const isExpired = new Date(passwordReset.expiresAt) < new Date();

            return (
              <li key={passwordReset.token} class="flex items-center">
                <span class="mr-4">
                  {passwordReset.username}: {passwordReset.token}{" "}
                  -{isExpired ? " Expirado" : " Ativo"}
                </span>
                <a
                  href={`/db/delete?itemPath=password_reset,${passwordReset.token}`}
                  class="bg-red-900 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                >
                  Excluir
                </a>
              </li>
            );
          })}
        </ul>

        {password_reset_list.length === 0 && (
          <p class="text-gray-500 mt-4">
            Nenhum token de recuperação cadastrado.
          </p>
        )}
      </div>
    </div>
  );
}
