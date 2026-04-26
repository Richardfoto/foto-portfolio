// app/api/booking/route.ts
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, service, date, message } = body;

    if (!name || !email || !service) {
      return NextResponse.json(
        { error: "Név, email és szolgáltatás megadása kötelező!" },
        { status: 400 },
      );
    }

    if (!process.env.CONTACT_EMAIL) {
      console.error("❌ CONTACT_EMAIL nincs beállítva");
      return NextResponse.json({ error: "CONFIG_ERROR" }, { status: 500 });
    }

    const html = `
      <h2>Új foglalási kérés érkezett</h2>
      <p><strong>Név:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || "Nem adott meg"}</p>
      <p><strong>Szolgáltatás:</strong> ${service}</p>
      <p><strong>Kívánt időpont:</strong> ${date || "Nem adott meg"}</p>
      <p><strong>Megjegyzés:</strong></p>
      <p>${message ? message.split("\n").join("<br>") : "Nem adott meg"}</p>
      <hr>
      <p><small>Richard Foto • Booking System</small></p>
    `;

    const { data, error } = await resend.emails.send({
      from: "Richard Foto <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      subject: `Új foglalás: ${name} - ${service}`,
      html,
      replyTo: email,
    });

    // 🔥 EZ A LÉNYEG
    console.log("RESEND RESULT:", JSON.stringify({ data, error }, null, 2));

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      return NextResponse.json({ error: "SEND_FAILED" }, { status: 500 });
    }

    console.log("✅ EMAIL ELKÜLDVE:", data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
