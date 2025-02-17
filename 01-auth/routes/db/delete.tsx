import { Handlers, PageProps } from "$fresh/server.ts";
import { urlToEsbuildResolution } from "https://jsr.io/@luca/esbuild-deno-loader/0.11.0/src/shared.ts";

interface DbDeletionResponse {
  itemPath: string;
  deleted: boolean;
  error_message?: string;
}

export const handler: Handlers<DbDeletionResponse> = {
  async GET(_req, ctx) {
    const url = new URL(_req.url);
    const params = url.searchParams;
    const itemPath = params.get("itemPath");

    if (!itemPath) {
      return ctx.render({ itemPath: "", deleted: false });
    }

    try {
      const kv = await Deno.openKv();
      await kv.delete(itemPath.split(","));

      await kv.close();
      return ctx.render({ itemPath, deleted: true });
    } catch (error: any) {
      console.error(error);
      return ctx.render({
        itemPath,
        deleted: false,
        error_message: error.message,
      });
    }
  },
};

export default function DeleteDatabase(
  { data }: PageProps<DbDeletionResponse>,
) {
  const { deleted, itemPath, error_message } = data;

  if (deleted) {
    return (
      <div class="p-4 bg-gray-900 text-white min-h-screen">
        <h1 class="text-2xl font-bold mb-4">Registro Deletado</h1>
        <p class="mb-4">
          O registro {itemPath} foi excluído com sucesso.
        </p>
        <a href="/db/list-all" class="text-blue-400 hover:underline">
          Voltar para lista
        </a>
      </div>
    );
  } else {
    return (
      <div class="p-4 bg-gray-900 text-white min-h-screen">
        <h1 class="text-2xl font-bold mb-4">Erro ao Deletar</h1>
        <p class="mb-4">Ocorreu um erro ao deletar os registros.</p>
        {error_message && <p class="mb-4">{error_message}</p>}
        <a href="/db/list-all" class="text-blue-400 hover:underline">
          Voltar para lista
        </a>
      </div>
    );
  }
}
