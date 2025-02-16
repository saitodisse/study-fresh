import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailConfig) {
  const client = new SmtpClient();

  await client.connectTLS({
    hostname: "smtp.gmail.com",
    port: 465,
    username: Deno.env.get("GCP_EMAIL")!,
    password: Deno.env.get("GCP_CLIENT_SECRET")!,
  });

  await client.send({
    from: Deno.env.get("GCP_EMAIL")!,
    to: to,
    subject: subject,
    content: html,
  });

  await client.close();
}
