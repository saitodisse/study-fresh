import { Handlers, PageProps } from "$fresh/server.ts";
import { sendEmail } from "../../../utils/email.ts";
import { User } from "../../model/User.ts";
import { PasswordReset } from "../../../types/PasswordReset.tsx";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const username = form.get("username")?.toString();

    if (!username) {
      return _ctx.render!({
        message: "Username é obrigatório",
        error: true,
      });
    }

    const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);

    // 1. Check if user exists
    const userResult = await kv.get<User>(["users", username]);

    if (!userResult.value) {
      // Return same message even if user doesn't exist (security best practice)
      return _ctx.render!({
        message:
          "Se o usuário existir, você receberá instruções de recuperação.",
      });
    }

    // 2. Generate unique token with expiration
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    // 3. Save reset token in KV store
    const resetData: PasswordReset = {
      username,
      token,
      expiresAt,
    };

    const result = await kv.set(["password_reset", token], resetData);

    if (!result.ok) {
      return _ctx.render!({
        message: "Erro ao processar recuperação de senha. Tente novamente.",
        error: true,
      });
    }

    // 4. Send recovery email
    const resetLink = `${req.url}/reset/${token}`;
    try {
      await sendEmail({
        to: userResult.value?.email, // Assumindo que o username é um email
        subject: "Recuperação de Senha",
        html: `
          <h1>Recuperação de Senha</h1>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Este link expira em 10 minutos.</p>
        `,
      });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      return _ctx.render!({
        message: "Erro ao enviar email de recuperação. Tente novamente.",
        error: true,
      });
    }

    return _ctx.render!({
      message: "Se o usuário existir, você receberá instruções de recuperação.",
    });
  },

  GET(_req, ctx) {
    return ctx.render!({});
  },
};

export default function ForgotPasswordPage(props: PageProps) {
  const message = props.data?.message;
  const isError = props.data?.error;
  return (
    <div class="px-8 py-8 mx-auto">
      <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl">
        <div class="max-w-screen-md mx-auto flex flex-col">
          <h1 class="text-4xl font-bold text-white">Recuperar Senha</h1>
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
            <div class="mb-6">
              <label class="block text-white text-2xl" htmlFor="username">
                Usuário:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                class="mt-2 text-2xl px-4 py-3 border rounded w-full bg-gray-700 text-white border-gray-600 focus:border-gray-500 focus:ring"
                required
              />
            </div>
            <button
              type="submit"
              class="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-2xl"
            >
              Recuperar Senha
            </button>
            <a
              href="/login"
              class="ml-6 text-blue-300 hover:underline text-2xl"
            >
              Voltar ao login
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
