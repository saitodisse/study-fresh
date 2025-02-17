import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { EmailConfig } from "../types/EmailConfig.ts";

export async function sendEmail({ to, subject, html, text }: EmailConfig) {
  const mailerSend = new MailerSend({
    apiKey: Deno.env.get("MAILER_SEND_API_KEY") as string,
  });

  const sentFrom = new Sender(
    "robot@trial-0r83ql372opgzw1j.mlsender.net",
    "AUTH HELPER",
  );

  const recipients = [
    new Recipient(to, "Client Name Example"),
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(html)
    .setText(text || "");

  await mailerSend.email.send(emailParams);
}
