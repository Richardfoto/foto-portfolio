import { Resend } from "resend";
import { NextResponse } from "next/server";
import { escapeHtml, renderField } from "@/lib/email";
import { validateBookingPayload } from "@/lib/forms";

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function POST(request: Request) {
  try {
    const validation = validateBookingPayload(await request.json());

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const resendClient = getResend();
    if (!resendClient || !process.env.CONTACT_EMAIL) {
      console.error("CONTACT_EMAIL or RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "CONFIG_ERROR" }, { status: 500 });
    }

    const { name, email, phone, service, date, message } = validation.data;
    const { error } = await resendClient.emails.send({
      from: "Richard Foto <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      subject: `Új foglalás: ${name} - ${service}`,
      replyTo: email,
      html: `
        <h2>Új foglalási kérés érkezett</h2>
        ${renderField("Név", name)}
        ${renderField("Email", email)}
        ${renderField("Telefon", phone || "Nem adott meg")}
        ${renderField("Szolgáltatás", service)}
        ${renderField("Kívánt időpont", date || "Nem adott meg")}
        <p><strong>Megjegyzés:</strong></p>
        <p>${message ? escapeHtml(message).replace(/\n/g, "<br>") : "Nem adott meg"}</p>
        <hr>
        <p><small>Richard Foto • Booking System</small></p>
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
