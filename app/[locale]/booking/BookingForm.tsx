"use client";
import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type ServiceOption = {
  _id: string;
  title: string;
};

export default function BookingForm({
  contactEmail,
  services,
  initialService = "",
}: {
  contactEmail: string;
  services: ServiceOption[];
  initialService?: string;
}) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const isHu = locale === "hu";
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(initialService);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "fallback"
  >("idle");
  const [validationError, setValidationError] = useState("");
  const [fallbackMailto, setFallbackMailto] = useState("");

  const isValidForm =
    name.trim().length >= 2 && email.includes("@") && service.trim().length > 0;

  function createMailtoLink() {
    const subject = isHu
      ? `Foglalási kérés - ${service || "fotózás"}`
      : `Booking request - ${service || "photo session"}`;
    const body = [
      isHu ? "Szia Richard," : "Hi Richard,",
      "",
      isHu
        ? "Szeretnék időpontot egyeztetni fotózásra."
        : "I would like to arrange a photography session.",
      "",
      `${t("name")}: ${name}`,
      `${t("email")}: ${email}`,
      `${t("phone")}: ${phone || "-"}`,
      `${t("service")}: ${service}`,
      `${t("date")}: ${date || "-"}`,
      `${t("message")}: ${message || "-"}`,
      "",
      isHu ? "Köszönöm!" : "Thank you!",
    ].join("\n");

    return `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidForm) {
      setValidationError(t("validationError"));
      return;
    }

    setValidationError("");
    setFallbackMailto("");
    setStatus("loading");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, date, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setService(initialService);
        setDate("");
        setMessage("");
      } else {
        setFallbackMailto(createMailtoLink());
        setStatus("fallback");
      }
    } catch (error) {
      console.error(error);
      setFallbackMailto(createMailtoLink());
      setStatus("fallback");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-6xl">✓</span>
        </div>
        <h3 className="text-3xl font-serif mb-4">{t("successTitle")}</h3>
        <p className="text-zinc-600 max-w-xs mx-auto">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label
            htmlFor={`${id}-name`}
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("name")}
          </label>
          <input
            id={`${id}-name`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full border-b border-zinc-300 bg-transparent py-4 text-lg outline-none transition-colors focus:border-zinc-900"
          />
        </div>
        <div>
          <label
            htmlFor={`${id}-email`}
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("email")}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full border-b border-zinc-300 bg-transparent py-4 text-lg outline-none transition-colors focus:border-zinc-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label
            htmlFor={`${id}-phone`}
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("phone")}
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="w-full border-b border-zinc-300 bg-transparent py-4 text-lg outline-none transition-colors focus:border-zinc-900"
          />
        </div>
        <div>
          <label
            htmlFor={`${id}-date`}
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("date")}
          </label>
          <input
            id={`${id}-date`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-b border-zinc-300 bg-transparent py-4 text-lg outline-none transition-colors focus:border-zinc-900"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${id}-service`}
          className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500"
        >
          {t("service")}
        </label>
        <select
          id={`${id}-service`}
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
          className="w-full border-b border-zinc-300 bg-white py-4 text-lg outline-none transition-colors focus:border-zinc-900"
        >
          <option value="" disabled>
            {t("selectPackage")}
          </option>
          {services.map((s) => (
            <option key={s._id} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value={t("other")}>{t("other")}</option>
        </select>
      </div>

      <div>
        <label
          htmlFor={`${id}-message`}
          className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-500"
        >
          {t("message")}
        </label>
        <textarea
          id={`${id}-message`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full resize-y border-b border-zinc-300 bg-transparent py-4 text-lg outline-none transition-colors focus:border-zinc-900"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading" || !isValidForm}
        className="w-full border border-zinc-900 py-5 text-sm uppercase tracking-[0.15em] transition-all hover:bg-zinc-900 hover:text-white disabled:opacity-50"
      >
        {status === "loading" ? t("sending") : t("send")}
      </button>

      <div aria-live="polite">
        {validationError && (
          <p className="text-red-500 text-sm text-center">{validationError}</p>
        )}
        {status === "fallback" && (
          <div className="border border-amber-200 bg-amber-50 p-5 text-center">
            <p className="text-sm leading-6 text-amber-900">
              {isHu
                ? "Az automatikus emailküldés most nem elérhető. A foglalási adatokból előkészítettem egy emailt, amit egy kattintással elküldhetsz."
                : "Automatic email sending is temporarily unavailable. I prepared an email from your booking details that you can send with one click."}
            </p>
            {fallbackMailto && (
              <a
                href={fallbackMailto}
                className="mt-4 inline-flex bg-zinc-900 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-zinc-700"
              >
                {isHu ? "Email megnyitása" : "Open email"}
              </a>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
