import { Resend } from "resend";
import { NextResponse } from "next/server";
import { escapeHtml, renderField } from "@/lib/email";
import { validateContactPayload } from "@/lib/forms";

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function POST(request: Request) {
  try {
    const validation = validateContactPayload(await request.json());

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const resendClient = getResend();
    if (!resendClient || !process.env.CONTACT_EMAIL) {
      console.error("CONTACT_EMAIL or RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "CONFIG_ERROR" }, { status: 500 });
    }

    const { name, email, message } = validation.data;
    const { error } = await resendClient.emails.send({
      from: "Richard Foto <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      subject: `Új üzenet: ${name}`,
      replyTo: email,
      html: `
        <h2>Új kapcsolatfelvétel érkezett</h2>
        ${renderField("Név", name)}
        ${renderField("Email", email)}
        <p><strong>Üzenet:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Richard Foto • Contact Form</small></p>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
