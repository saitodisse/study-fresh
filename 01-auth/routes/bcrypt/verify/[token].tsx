import { Handlers, PageProps } from "$fresh/server.ts";
import { EmailVerification } from "../../../types/EmailVerification.ts";
import { User } from "../../model/User.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { token } = ctx.params;
    const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);

    // Get verification data
    const verificationResult = await kv.get<EmailVerification>([
      "email_verification",
      token,
    ]);
    if (!verificationResult.value) {
      return ctx.render!({
        message: "Link de verificação inválido.",
        error: true,
      });
    }

    const verification = verificationResult.value;

    // Check if token is expired
    if (verification.expiresAt < new Date()) {
      await kv.delete(["email_verification", token]);
      return ctx.render!({
        message: "Link de verificação expirado.",
        error: true,
      });
    }

    // Update user verified status
    const userKey = ["users", verification.username];
    const tokenKey = ["email_verification", token];
    const userResult = await kv.get<User>(userKey);

    if (!userResult.value) {
      return ctx.render!({ message: "Usuário não encontrado.", error: true });
    }

    const updatedUser: User = {
      ...userResult.value,
      verified: true,
    };

    const transaction = await kv.atomic()
      .check({ key: userKey, versionstamp: userResult.versionstamp })
      .set(userKey, updatedUser)
      .delete(tokenKey)
      .commit();

    if (!transaction.ok) {
      return ctx.render!({
        message: "Erro ao verificar email. Tente novamente.",
        error: true,
      });
    }

    return ctx.render!({
      message: "Email verificado com sucesso! Você já pode fazer login.",
      error: false,
    });
  },
};

export default function VerifyEmailPage(props: PageProps) {
  const message = props.data?.message;
  const isError = props.data?.error;

  return (
    <div class="px-8 py-8 mx-auto">
      <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl">
        <div class="max-w-screen-md mx-auto flex flex-col">
          <h1 class="text-4xl font-bold text-white">Verificação de Email</h1>
          {message && (
            <p
              class={`mt-4 ${
                isError ? "text-red-400" : "text-green-400"
              } text-2xl`}
            >
              {message}
            </p>
          )}
          <a
            href="/bcrypt/login"
            class="mt-6 text-blue-300 hover:underline text-2xl"
          >
            Ir para o login
          </a>
        </div>
      </div>
    </div>
  );
}
