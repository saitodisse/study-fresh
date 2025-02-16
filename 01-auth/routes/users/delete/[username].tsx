import { Handlers, PageProps } from "$fresh/server.ts";

interface Data {
  username: string;
  deleted: boolean;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const username = ctx.params.username;
    return ctx.render({ username, deleted: false });
  },

  async POST(req, ctx) {
    const username = ctx.params.username;
    const kv = await Deno.openKv();
    
    // Deleta o usuário
    await kv.delete(["users", username]);
    await kv.close();

    return ctx.render({ username, deleted: true });
  },
};

export default function DeleteUser({ data }: PageProps<Data>) {
  const { username, deleted } = data;

  if (deleted) {
    return (
      <div class="p-4 bg-gray-900 text-white min-h-screen">
        <h1 class="text-2xl font-bold mb-4">Usuário Excluído</h1>
        <p class="mb-4">O usuário "{username}" foi excluído com sucesso.</p>
        <a href="/users/all-users" class="text-blue-400 hover:underline">
          Voltar para lista de usuários
        </a>
      </div>
    );
  }

  return (
    <div class="p-4 bg-gray-900 text-white min-h-screen">
      <h1 class="text-2xl font-bold mb-4">Confirmar Exclusão</h1>
      <p class="mb-4">Tem certeza que deseja excluir o usuário "{username}"?</p>
      <form method="POST">
        <button
          type="submit"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
        >
          Confirmar Exclusão
        </button>
        <a
          href="/users/all-users"
          class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block"
        >
          Cancelar
        </a>
      </form>
    </div>
  );
}
