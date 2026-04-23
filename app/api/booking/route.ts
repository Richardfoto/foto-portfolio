import { Resend } from "resend";
import { NextResponse } from "next/server";
import { renderField } from "@/lib/email";
import { validateBookingPayload } from "@/lib/forms";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const result = validateBookingPayload(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { name, email, phone, service, date, message } = result.data;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.CONTACT_EMAIL!,
      subject: `Új foglalási kérés: ${name} - ${service}`,
      html: `
        <h2>Új foglalási kérés</h2>
        ${renderField("Név", name)}
        ${renderField("Email", email)}
        ${renderField("Telefon", phone || "-")}
        ${renderField("Csomag", service)}
        ${renderField("Kívánt időpont", date || "-")}
        ${renderField("Megjegyzés", message || "-")}
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
  }
}
