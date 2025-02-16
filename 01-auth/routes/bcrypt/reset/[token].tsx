import { Handlers, PageProps } from "$fresh/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../../api/types/User.ts";

interface PasswordReset {
  username: string;
  token: string;
  expiresAt: Date;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const { token } = ctx.params;
    const form = await req.formData();
    const password = form.get("password")?.toString();

    if (!password) {
      return ctx.render!({
        message: "Nova senha é obrigatória",
        error: true,
      });
    }

    const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);

    // Verify token and get reset data
    const resetResult = await kv.get<PasswordReset>(["password_reset", token]);
    if (!resetResult.value) {
      return ctx.render!({
        message: "Token inválido ou expirado",
        error: true,
      });
    }

    const resetData = resetResult.value;
    if (new Date() > new Date(resetData.expiresAt)) {
      await kv.delete(["password_reset", token]);
      return ctx.render!({
        message: "Token expirado. Solicite um novo reset de senha.",
        error: true,
      });
    }

    // Update user password
    const userResult = await kv.get<User>(["users", resetData.username]);
    if (!userResult.value) {
      return ctx.render!({
        message: "Usuário não encontrado",
        error: true,
      });
    }

    const user = userResult.value;
    user.password = await bcrypt.hash(password);

    const updateResult = await kv.set(["users", user.username], user);
    if (!updateResult.ok) {
      return ctx.render!({
        message: "Erro ao atualizar senha. Tente novamente.",
        error: true,
      });
    }

    // Delete used token
    await kv.delete(["password_reset", token]);

    // Redirect to login
    const searchParams = new URLSearchParams();
    searchParams.set("message", "Senha atualizada com sucesso!");
    return Response.redirect(`/login?${searchParams.toString()}`);
  },

  GET(_req, ctx) {
    return ctx.render!({});
  },
};

export default function ResetPasswordPage(props: PageProps) {
  const message = props.data?.message;
  const isError = props.data?.error;

  return (
    <div class="px-4 py-8 mx-auto">
      <div class="max-w-screen-md mx-auto flex flex-col">
        <h1 class="text-2xl font-bold">Redefinir Senha</h1>
        {message && (
          <p class={`mt-4 ${isError ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}
        <form class="mt-4" method="POST">
          <div class="mb-4">
            <label class="block" htmlFor="password">
              Nova Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              class="mt-2 px-3 py-2 border rounded w-full bg-gray-800 text-white border-gray-600 focus:border-gray-500 focus:ring-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Atualizar Senha
          </button>
        </form>
      </div>
    </div>
  );
}
