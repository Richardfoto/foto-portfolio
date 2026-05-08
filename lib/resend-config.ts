import { Resend } from "resend";

let resend: Resend | null = null;

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  return trimmed.replace(/^["']|["']$/g, "").trim();
}

export function getResend() {
  const apiKey = cleanEnvValue(process.env.RESEND_API_KEY);
  if (!apiKey || apiKey.startsWith("IDE_TEDD_")) return null;
  resend ??= new Resend(apiKey);
  return resend;
}

export function getContactEmail() {
  return cleanEnvValue(process.env.CONTACT_EMAIL);
}

export function getResendFromEmail() {
  return cleanEnvValue(process.env.RESEND_FROM_EMAIL) || "Richard Foto <onboarding@resend.dev>";
}

export async function forwardLocalEmailRequest(
  path: "/api/contact" | "/api/booking",
  payload: unknown,
) {
  if (process.env.NODE_ENV !== "development") return null;

  const response = await fetch(`https://foto-portfolio-psi.vercel.app${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response;
}
