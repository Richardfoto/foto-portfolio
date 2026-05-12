import { NextResponse } from "next/server";
import { escapeHtml, renderField } from "@/lib/email";
import { validateBookingPayload } from "@/lib/forms";
import {
  forwardLocalEmailRequest,
  getContactEmail,
  getResend,
  getResendFromEmail,
} from "@/lib/resend-config";

function renderCustomerConfirmationEmail({
  name,
  service,
  date,
  locale,
}: {
  name: string;
  service: string;
  date?: string;
  locale: "hu" | "en";
}) {
  const isHu = locale === "hu";
  const greetingName = escapeHtml(name.split(" ")[0] || name);
  const safeService = escapeHtml(service);
  const safeDate = date ? escapeHtml(date) : "";

  if (!isHu) {
    return `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171717;max-width:640px">
        <p style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#777">Richard Foto</p>
        <h2 style="font-family:Georgia,serif;font-size:28px;font-weight:400;margin:0 0 18px">I received your inquiry.</h2>
        <p>Hi ${greetingName},</p>
        <p>Thank you for reaching out. Your booking inquiry has arrived, and I will get back to you soon to discuss the details.</p>
        <div style="margin:28px 0;padding:18px 20px;background:#faf8f2;border:1px solid #e8e0d2">
          <p style="margin:0 0 8px"><strong>Selected direction:</strong> ${safeService}</p>
          ${safeDate ? `<p style="margin:0"><strong>Preferred date:</strong> ${safeDate}</p>` : ""}
        </div>
        <p>This email only confirms that your inquiry was received. The date becomes final after personal coordination.</p>
        <p>Richard</p>
      </div>
    `;
  }

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171717;max-width:640px">
      <p style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#777">Richard Foto</p>
      <h2 style="font-family:Georgia,serif;font-size:28px;font-weight:400;margin:0 0 18px">Megkaptam a megkeresésed.</h2>
      <p>Szia ${greetingName},</p>
      <p>Köszönöm, hogy írtál. A foglalási érdeklődésed megérkezett hozzám, hamarosan felveszem veled a kapcsolatot, hogy egyeztessük a részleteket.</p>
      <div style="margin:28px 0;padding:18px 20px;background:#faf8f2;border:1px solid #e8e0d2">
        <p style="margin:0 0 8px"><strong>Választott irány:</strong> ${safeService}</p>
        ${safeDate ? `<p style="margin:0"><strong>Kívánt időpont:</strong> ${safeDate}</p>` : ""}
      </div>
      <p>Ez az email csak azt igazolja vissza, hogy az érdeklődésed beérkezett. Az időpont a személyes egyeztetés után válik véglegessé.</p>
      <p>Richard</p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateBookingPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const resendClient = getResend();
    const contactEmail = getContactEmail();
    if (!resendClient || !contactEmail) {
      const forwarded = await forwardLocalEmailRequest("/api/booking", payload);
      if (forwarded?.ok) {
        return NextResponse.json({ success: true });
      }

      console.error("CONTACT_EMAIL or RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "CONFIG_ERROR" }, { status: 500 });
    }

    const { name, email, phone, service, date, message, locale = "hu" } = validation.data;
    const { error } = await resendClient.emails.send({
      from: getResendFromEmail(),
      to: contactEmail,
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

    const confirmation = await resendClient.emails.send({
      from: getResendFromEmail(),
      to: email,
      subject:
        locale === "hu"
          ? "Megkaptam a foglalási megkeresésed"
          : "I received your booking inquiry",
      replyTo: contactEmail,
      html: renderCustomerConfirmationEmail({ name, service, date, locale }),
    });

    if (confirmation.error) {
      console.error("RESEND CONFIRMATION ERROR:", confirmation.error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
