import { Handlers, PageProps } from "$fresh/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { PasswordReset } from "../../../../types/PasswordReset.tsx";
import { User } from "../../../model/User.ts";
import { FormInput } from "../../../../components/FormInput.tsx";
import { PrimaryButton } from "../../../../components/PrimaryButton.tsx";

export const handler: Handlers = {
  async POST(req, ctx) {
    console.log("[Password Reset] Starting password reset process");
    const { token } = ctx.params;
    console.log("[Password Reset] Token:", token);

    const form = await req.formData();
    const password = form.get("password")?.toString();

    if (!password) {
      console.log("[Password Reset] Error: No password provided");
      return ctx.render!({
        message: "Nova senha é obrigatória",
        error: true,
      });
    }

    console.log("[Password Reset] Opening KV store");
    const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);

    // Verify token and get reset data
    console.log("[Password Reset] Verifying reset token");
    const resetResult = await kv.get<PasswordReset>(["password_reset", token]);
    if (!resetResult.value) {
      console.log("[Password Reset] Error: Invalid or expired token");
      return ctx.render!({
        message: "Token inválido ou expirado",
        error: true,
      });
    }

    const resetData = resetResult.value;
    console.log("[Password Reset] Reset data found:", {
      username: resetData.username,
      expiresAt: resetData.expiresAt,
    });

    if (new Date() > new Date(resetData.expiresAt)) {
      console.log("[Password Reset] Error: Token expired");
      await kv.delete(["password_reset", token]);
      return ctx.render!({
        message: "Token expirado. Solicite um novo reset de senha.",
        error: true,
      });
    }

    // Update user password
    console.log("[Password Reset] Finding user:", resetData.username);
    const userResult = await kv.get<User>(["users", resetData.username]);
    if (!userResult.value) {
      console.log("[Password Reset] Error: User not found");
      return ctx.render!({
        message: "Usuário não encontrado",
        error: true,
      });
    }

    const user = userResult.value;
    console.log("[Password Reset] Hashing new password");
    user.password = await bcrypt.hash(password);

    console.log("[Password Reset] Updating user password");
    const updateResult = await kv.set(["users", user.username], user);
    if (!updateResult.ok) {
      console.log("[Password Reset] Error: Failed to update password");
      return ctx.render!({
        message: "Erro ao atualizar senha. Tente novamente.",
        error: true,
      });
    }

    // Delete used token
    console.log("[Password Reset] Deleting used token");
    await kv.delete(["password_reset", token]);

    console.log("[Password Reset] Password reset successful");
    // Redirect to login
    // const searchParams = new URLSearchParams();
    // searchParams.set("message", "Senha atualizada com sucesso!");
    // return Response.redirect(`/bcrypt/login?${searchParams.toString()}`);

    // Cria um novo objeto Headers copiando os cabeçalhos da requisição
    const headers = new Headers(req.headers);
    // Define o cabeçalho de redirecionamento para a página inicial
    headers.set("location", "/?message='Senha atualizada com sucesso!'");
    // Retorna uma resposta vazia com status 302 (Found/Redirect) e os cabeçalhos configurados
    return new Response(null, {
      status: 302,
      headers,
    });
  },

  GET(_req, ctx) {
    return ctx.render!({});
  },
};

export default function ResetPasswordPage(props: PageProps) {
  const message = props.data?.message;
  const isError = props.data?.error;
  return (
    <div class="px-8 py-8 mx-auto">
      <div class="p-8 bg-gray-900 rounded-2xl shadow-2xl">
        <div class="max-w-screen-md mx-auto flex flex-col">
          <h1 class="text-4xl font-bold text-white">Redefinir Senha</h1>
          {message && (
            <p
              class={`mt-4 ${
                isError ? "text-red-400" : "text-green-400"
              } text-2xl`}
            >
              {message}
            </p>
          )}
          <form class="mt-6" method="POST">
            <FormInput
              label="Nova Senha:"
              type="password"
              id="password"
              name="password"
              required
            />
            <PrimaryButton type="submit">
              Atualizar Senha
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
