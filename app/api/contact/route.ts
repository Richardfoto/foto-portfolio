import { Resend } from "resend";
import { NextResponse } from "next/server";
import { renderField } from "@/lib/email";
import { validateContactPayload } from "@/lib/forms";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validateContactPayload(body);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { name, email, message } = result.data;

    if (!process.env.CONTACT_EMAIL) {
      console.error("CONTACT_EMAIL nincs beállítva");
      return NextResponse.json({ error: "CONFIG_ERROR" }, { status: 500 });
    }

    const html = `
      <h2>Új kapcsolatfelvétel</h2>
      ${renderField("Név", name)}
      ${renderField("Email", email)}
      <p><strong>Üzenet:</strong></p>
      <p>${message.split("\n").join("<br />")}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.CONTACT_EMAIL,
      subject: `Új üzenet: ${name}`,
      html,
      replyTo: email, // 🔥 nagyon fontos
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
    }

    console.log("EMAIL SENT:", data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
