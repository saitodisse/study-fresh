import { Handlers, PageProps } from "$fresh/server.ts";
import { User } from "../model/User.ts";
import { Session } from "../../types/Session.ts";
import { PrimaryLink } from "../../components/PrimaryLink.tsx";
import { PasswordReset } from "../../types/PasswordReset.tsx";

interface ListAllData {
  users: User[];
  sessions: Session[];
  passwords_resets: PasswordReset[];
}

export const handler: Handlers<ListAllData> = {
  async GET(_req, ctx) {
    const kv = await Deno.openKv();

    // Get all users
    const users: User[] = [];
    const userEntries = kv.list<User>({ prefix: ["users"] });
    for await (const entry of userEntries) {
      users.push(entry.value);
    }

    // Get active sessions
    const sessions: Session[] = [];
    const now = new Date();
    const sessionEntries = kv.list<Session>({ prefix: ["sessions"] });
    for await (const entry of sessionEntries) {
      if (entry.value.expiresAt > now) {
        sessions.push(entry.value);
      }
    }

    // Get passwords_resets
    const passwords_resets: PasswordReset[] = [];
    const passwordEntries = kv.list<PasswordReset>({
      prefix: ["password_reset"],
    });
    for await (const entry of passwordEntries) {
      passwords_resets.push(entry.value);
    }

    return ctx.render({ users, sessions, passwords_resets });
  },
};

export default function ListAll({ data }: PageProps<ListAllData>) {
  return (
    <div class="p-4">
      <h1 class="text-4xl font-bold text-white mb-8">Database Contents</h1>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">
          Active Sessions ({data.sessions.length})
        </h2>
        <table class="w-full text-left text-white">
          <thead>
            <tr class="border-b border-gray-600">
              <th class="p-2">Username</th>
              <th class="p-2">Token</th>
              <th class="p-2">Created At</th>
              <th class="p-2">Expires At</th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.sessions.map((session) => (
              <tr class="border-b border-gray-700" key={session.token}>
                <td class="p-2">{session.username}</td>
                <td class="p-2">{session.token}</td>
                <td class="p-2">
                  {new Date(session.createdAt).toLocaleString()}
                </td>
                <td class="p-2">
                  {new Date(session.expiresAt).toLocaleString()}
                </td>
                <td class="p-2">
                  <a
                    href={`/db/delete?itemPath=sessions,${session.token}`}
                    class="text-red-500 hover:text-red-300"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">
          Users ({data.users.length})
        </h2>
        <table class="w-full text-left text-white">
          <thead>
            <tr class="border-b border-gray-600">
              <th class="p-2">Username</th>
              <th class="p-2">Email</th>
              <th class="p-2">Verified</th>
              <th class="p-2">Created At</th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <tr class="border-b border-gray-700" key={user.username}>
                <td class="p-2">{user.username}</td>
                <td class="p-2">{user.email}</td>
                <td class="p-2">{user.verified ? "✅" : "❌"}</td>
                <td class="p-2">{new Date(user.createdAt).toLocaleString()}</td>
                <td class="p-2">
                  <a
                    href={`/db/delete?itemPath=users,${user.username}`}
                    class="text-red-500 hover:text-red-300"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* password reset tokens */}
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">
          Password Reset Tokens ({data.passwords_resets.length})
        </h2>
        <table class="w-full text-left text-white">
          <thead>
            <tr class="border-b border-gray-600">
              <th class="p-2">Username</th>
              <th class="p-2">Token</th>
              <th class="p-2">Expires At</th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.passwords_resets.map((password_reset) => (
              <tr
                class="border-b border-gray-700"
                key={password_reset.token}
              >
                <td class="p-2">{password_reset.username}</td>
                <td class="p-2">{password_reset.token}</td>
                <td class="p-2">
                  {new Date(password_reset.expiresAt).toLocaleString()}
                </td>
                <td class="p-2">
                  <a
                    href={`/db/delete?itemPath=password_reset,${password_reset.token}`}
                    class="text-red-500 hover:text-red-300"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PrimaryLink href="/">Voltar para Home</PrimaryLink>
    </div>
  );
}
