/// <reference lib="deno.unstable" />
import { Handlers, PageProps } from "$fresh/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { sendEmail } from "../../utils/email.ts";
import { EmailVerification } from "../../types/EmailVerification.ts";
import { User } from "../model/User.ts";
import { FormInput } from "../../components/FormInput.tsx";
import { PrimaryLink } from "../../components/PrimaryLink.tsx";
import SubmitButtonIsland from "../../islands/SubmitButtonIsland.tsx";

/**
 * Signin page
 * -----------
 * This page allows users to create an account.
 */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const username = form.get("username")?.toString() || "";
    const email = form.get("email")?.toString() || "";
    const password = form.get("password")?.toString() || "";

    if (!username || !email || !password) {
      const searchParams = new URLSearchParams();
      searchParams.set("message", "Usuário, email e senha são obrigatórios!");
      searchParams.set("message_type", "error");
      return Response.redirect(`/signin?${searchParams.toString()}`);
    }

    // Check if user already exists
    const kv = await Deno.openKv(Deno.env.get("KV_STORE")!);
    const userResult = await kv.get<User>(["users", username]);

    if (userResult.value) {
      return _ctx.render!({
        message:
          "Usuário já cadastrado. Favor escolher outro username ou fazer login.",
        message_type: "error",
      });
    }

    // Create new user with verified status
    const passwordHash = await bcrypt.hash(password);
    const user: User = {
      username,
      email,
      password: passwordHash,
      createdAt: new Date(),
      verified: false,
    };

    // Generate verification token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const verificationData: EmailVerification = {
      username,
      email,
      token,
      expiresAt,
    };

    // Save user and verification data
    const userKey = ["users", username];
    const verificationKey = ["email_verification", token];

    const transaction = await kv.atomic()
      .check({ key: userKey, versionstamp: null }) // Check if user doesn't exist
      .set(userKey, user)
      .set(verificationKey, verificationData)
      .commit();

    console.log("Transaction result:", transaction);

    if (!transaction.ok) {
      const searchParams = new URLSearchParams();
      searchParams.set(
        "message",
        "Erro ao criar usuário. Tente novamente.",
      );
      searchParams.set("message_type", "error");
      return Response.redirect(`/signin?${searchParams.toString()}`);
    }

    // Send verification email
    const verificationLink = `${
      req.url.replace("/signin", "/verify")
    }/${token}`;
    try {
      await sendEmail({
        to: email,
        subject: "Verificação de Email",
        html: `
          <h1>Verificação de Email</h1>
          <p>Olá ${username},</p>
          <p>Por favor, clique no link abaixo para verificar seu email:</p>
          <a href="${verificationLink}">${verificationLink}</a>
          <p>Este link expira em 24 horas.</p>
        `,
      });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
    }

    return _ctx.render!({
      message:
        "Conta criada com sucesso! Por favor, verifique seu email para ativar sua conta.",
      message_type: "success",
    });
  },
};

export default function SigninPage(props: PageProps) {
  const message = props.data?.message;
  const messageType = props.data?.message_type ||
    new URL(props.url).searchParams.get("message_type");
  const messageClass = messageType === "error"
    ? "text-red-400"
    : "text-green-400";

  return (
    <>
      <h1 class="text-4xl font-bold text-white">Criar Conta</h1>
      {message && <p class={`mt-4 text-2xl ${messageClass}`}>{message}</p>}
      <form class="mt-6" method="POST">
        <FormInput
          label="Usuário:"
          type="text"
          id="username"
          name="username"
          required
        />
        <FormInput
          label="Email:"
          type="email"
          id="email"
          name="email"
          required
        />
        <FormInput
          label="Senha:"
          type="password"
          id="password"
          name="password"
          required
        />
        <SubmitButtonIsland text="Criar Conta" />
        <div className="block my-6">
          <PrimaryLink href="/bcrypt/login">
            Já tem uma conta? Faça login agora
          </PrimaryLink>
        </div>
      </form>
    </>
  );
}
