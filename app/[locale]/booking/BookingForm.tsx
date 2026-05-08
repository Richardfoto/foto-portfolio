"use client";
import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type ServiceOption = {
  _id: string;
  title: string;
};

type ServiceGroup = {
  title: string;
  options: readonly ServiceOption[];
};

type FlowCard = {
  title: string;
  text: string;
};

const sessionOptions = {
  hu: [
    { id: "basic", title: "Basic - 100 EUR-tól" },
    { id: "standard", title: "Standard - 200 EUR-tól" },
    { id: "premium", title: "Premium - 400 EUR-tól" },
  ],
  en: [
    { id: "basic", title: "Basic - EUR 100+" },
    { id: "standard", title: "Standard - EUR 200+" },
    { id: "premium", title: "Premium - EUR 400+" },
  ],
} as const;

export default function BookingForm({
  serviceGroups,
  initialService = "",
  selectedTitle,
  selectedFallback,
  selectedFallbackText,
  sideText,
  flowTitle,
  flowLead,
  flowCards,
}: {
  contactEmail: string;
  serviceGroups: ServiceGroup[];
  initialService?: string;
  selectedTitle: string;
  selectedFallback: string;
  selectedFallbackText: string;
  sideText: string;
  flowTitle: string;
  flowLead: string;
  flowCards: readonly FlowCard[];
}) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const isHu = locale === "hu";
  const id = useId();
  const defaultSessionPackage = sessionOptions[isHu ? "hu" : "en"].find(
    (option) => option.id === "standard",
  )?.title ?? "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(initialService);
  const [sessionPackage, setSessionPackage] = useState(defaultSessionPackage);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const dateLabel = date
    ? new Intl.DateTimeFormat(isHu ? "hu-HU" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(`${date}T12:00:00`))
    : "";

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const isValidDate = date.trim().length > 0 && date >= today;
  const hasContactDetails =
    name.trim().length >= 2 && email.includes("@") && email.includes(".");
  const isValidForm =
    service.trim().length > 0 &&
    sessionPackage.trim().length > 0 &&
    isValidDate &&
    hasContactDetails;
  const flowState = [
    {
      done: service.trim().length > 0,
      current: service.trim().length === 0,
      value: service,
      action: isHu ? "Válassz irányt" : "Choose direction",
      doneAction: isHu ? "Kiválasztva" : "Selected",
      href: "#booking-step-service",
    },
    {
      done: sessionPackage.trim().length > 0,
      current: service.trim().length > 0 && sessionPackage.trim().length === 0,
      value: sessionPackage,
      action: isHu ? "Csomag kiválasztása" : "Choose package",
      doneAction: isHu ? "Beállítva" : "Set",
      href: "#booking-step-session",
    },
    {
      done: isValidDate,
      current:
        service.trim().length > 0 &&
        sessionPackage.trim().length > 0 &&
        !isValidDate,
      value: dateLabel,
      action: isHu ? "Dátum kiválasztása" : "Choose date",
      doneAction: isHu ? "Dátum megadva" : "Date added",
      href: "#booking-step-date",
    },
    {
      done: note.trim().length > 0,
      current: isValidDate && note.trim().length === 0,
      value: note.trim() ? (isHu ? "Megjegyzés megadva" : "Note added") : "",
      action: isHu ? "Megjegyzés írása" : "Add notes",
      doneAction: isHu ? "Megírva" : "Written",
      href: "#booking-step-message",
    },
    {
      done: hasContactDetails,
      current: isValidDate && !hasContactDetails,
      value: hasContactDetails
        ? isHu
          ? `${name.trim()} - ${email.trim()}`
          : `${name.trim()} - ${email.trim()}`
        : "",
      action: isHu ? "Elérhetőség megadása" : "Add contact details",
      doneAction: isHu ? "Elérhetőség megadva" : "Contact added",
      href: "#booking-step-contact",
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidForm) {
      setValidationError(t("validationError"));
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          service: `${service.trim()} - ${sessionPackage.trim()}`,
          date,
          message: note.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Booking request failed");
      }

      setStatus("success");
    } catch {
      setValidationError(
        isHu
          ? "Nem sikerült elküldeni az érdeklődést. Kérlek próbáld újra, vagy írj közvetlenül emailt."
          : "I could not send the inquiry. Please try again or email me directly.",
      );
    } finally {
      setIsSubmitting(false);
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
    <div className="space-y-10">
      <section className="border-y border-neutral-200 bg-[#fbfaf7] p-5 md:p-6">
        <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
              {isHu ? "Átlátható folyamat" : "Clear process"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {flowTitle}
            </h2>
          </div>
          <p className="text-base leading-8 text-neutral-600">{flowLead}</p>
        </div>

        <div className="mt-10 grid gap-3 lg:grid-cols-5">
          {flowCards.map((card, index) => {
            const state = flowState[index];

            return (
              <article
                key={card.title}
                className={`border p-5 transition-colors ${
                  state.done
                    ? "border-neutral-950 bg-white text-neutral-950"
                    : state.current
                      ? "border-[#b79d66] bg-[#fff8e8] text-neutral-950"
                      : "border-neutral-200 bg-white text-neutral-500"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 font-serif text-xl leading-tight text-neutral-950">
                  {card.title}
                </h3>
                <p className="mt-4 min-h-[4.5rem] text-sm leading-6 text-neutral-600">
                  {state.value || card.text}
                </p>
                <a
                  href={state.href}
                  className={`mt-5 inline-flex w-full justify-center border px-4 py-3 text-center text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    state.done
                      ? "border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800"
                      : state.current
                        ? "border-[#b79d66] bg-white text-neutral-950 hover:border-neutral-950"
                        : "border-neutral-200 text-neutral-400 hover:border-neutral-400"
                  }`}
                >
                  {state.done ? state.doneAction : state.action}
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr]">
      <aside>
        <div className="sticky top-28 space-y-4">
          <div className="border border-neutral-200 bg-neutral-950 p-6 text-white shadow-[0_24px_70px_rgba(20,20,20,0.16)]">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
              {selectedTitle}
            </p>
            <h2 className="mt-5 font-serif text-3xl leading-tight">
              {service || selectedFallback}
            </h2>
            {!service && (
              <p className="mt-4 text-sm leading-7 text-white/60">
                {selectedFallbackText}
              </p>
            )}
            <div className="mt-8 border-t border-white/15 pt-6 text-sm leading-7 text-white/65">
              <p>{sideText}</p>
            </div>
          </div>

          <div
            className={`border p-6 transition-colors ${
              date
                ? "border-neutral-950 bg-white text-neutral-950"
                : "border-neutral-200 bg-[#fbfaf7] text-neutral-950"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
              {isHu ? "Kívánt időpont" : "Preferred date"}
            </p>
            <h2 className="mt-5 font-serif text-3xl leading-tight">
              {dateLabel || (isHu ? "Válassz ki egy napot" : "Choose a day")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              {date
                ? isHu
                  ? "Szuper, ez még nem végleges foglalás, de már van mihez igazítanom az elérhetőséget."
                  : "Great, this is not final yet, but it gives me a clear date to check availability around."
                : isHu
                  ? "A 03-as mezőben válassz egy preferált napot. Múltbéli dátumot nem enged a rendszer."
                  : "Use step 03 to choose a preferred day. Past dates are not allowed."}
            </p>
          </div>

          <div
            className={`border p-6 transition-colors ${
              service && date
                ? "border-[#b79d66] bg-[#fff8e8] text-neutral-950"
                : "border-neutral-200 bg-white text-neutral-400"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.24em]">
              {isHu ? "Majdnem kész" : "Almost there"}
            </p>
            <h2 className="mt-5 font-serif text-3xl leading-tight text-neutral-950">
              {service && date
                ? isHu
                  ? "Már csak pár kattintás."
                  : "Only a few clicks left."
                : isHu
                  ? "Válassz irányt és időpontot."
                  : "Choose direction and date."}
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              {service && date
                ? isHu
                  ? "Add meg az elérhetőséged, és az érdeklődés közvetlenül megérkezik hozzám."
                  : "Add your contact details and the inquiry will arrive directly to me."
                : isHu
                  ? "Ezután már csak a megjegyzés, az elérhetőség és a küldés marad."
                  : "After that, only the note, contact details and sending remain."}
            </p>
          </div>
        </div>
      </aside>

      <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5">
        <section
          id="booking-date"
          className="scroll-mt-40 border border-neutral-200 bg-[#fbfaf7] p-5 md:p-6"
        >
          <span id="booking-step-service" className="block scroll-mt-40" />
          <div className="grid gap-5 md:grid-cols-[4rem_1fr]">
            <span className="font-serif text-4xl leading-none text-neutral-300">
              01
            </span>
            <div>
          <label
            htmlFor={`${id}-service`}
            className="block text-xs uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("service")}
          </label>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {t("serviceHelp")}
          </p>
          <select
            id={`${id}-service`}
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="mt-4 w-full border-b border-zinc-300 bg-white py-4 text-lg outline-none transition-colors focus:border-zinc-900"
          >
            <option value="" disabled>
              {t("selectPackage")}
            </option>
            {serviceGroups.map((group) => (
              <optgroup key={group.title} label={group.title}>
                {group.options.map((s) => (
                  <option key={s._id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={t("other")}>{t("other")}</option>
          </select>
            </div>
          </div>
        </section>

        <section
          id="booking-step-session"
          className="scroll-mt-40 border border-neutral-200 bg-[#fbfaf7] p-5 md:p-6"
        >
          <div className="grid gap-5 md:grid-cols-[4rem_1fr]">
            <span className="font-serif text-4xl leading-none text-neutral-300">
              02
            </span>
            <div>
          <label
            htmlFor={`${id}-session`}
            className="block text-xs uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("session")}
          </label>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {t("sessionHelp")}
          </p>
          <select
            id={`${id}-session`}
            value={sessionPackage}
            onChange={(e) => setSessionPackage(e.target.value)}
            required
            className="mt-4 w-full border-b border-zinc-300 bg-white py-4 text-lg outline-none transition-colors focus:border-zinc-900"
          >
            <option value="" disabled>
              {t("selectSession")}
            </option>
            {sessionOptions[isHu ? "hu" : "en"].map((option) => (
              <option key={option.id} value={option.title}>
                {option.title}
              </option>
            ))}
          </select>
            </div>
          </div>
        </section>

        <section
          id="booking-step-date"
          className="scroll-mt-40 border border-neutral-200 bg-[#fbfaf7] p-5 md:p-6"
        >
          <div className="grid gap-5 md:grid-cols-[4rem_1fr]">
            <span className="font-serif text-4xl leading-none text-neutral-300">
              03
            </span>
            <div>
          <label
            htmlFor={`${id}-date`}
            className="block text-xs uppercase tracking-[0.2em] text-zinc-500"
          >
            {t("date")}
          </label>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {t("dateHelp")}
          </p>
          <input
            id={`${id}-date`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            required
            className="mt-4 w-full border-b border-zinc-300 bg-white py-4 text-lg outline-none transition-colors focus:border-zinc-900"
          />
            </div>
          </div>
        </section>

        <section
          id="booking-step-message"
          className="scroll-mt-40 border border-neutral-200 bg-[#fbfaf7] p-5 md:p-6"
        >
          <div className="grid gap-5 md:grid-cols-[4rem_1fr]">
            <span className="font-serif text-4xl leading-none text-neutral-300">
              04
            </span>
            <div>
        <label
          htmlFor={`${id}-message`}
          className="block text-xs uppercase tracking-[0.2em] text-zinc-500"
        >
          {t("message")}
        </label>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {t("messageHelp")}
        </p>
        <textarea
          id={`${id}-message`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          className="mt-4 w-full resize-y border-b border-zinc-300 bg-white py-4 text-lg outline-none transition-colors focus:border-zinc-900"
        />
            </div>
          </div>
        </section>

        <section
          id="booking-step-contact"
          className="scroll-mt-40 border border-neutral-200 bg-[#fbfaf7] p-5 md:p-6"
        >
          <div className="grid gap-5 md:grid-cols-[4rem_1fr]">
            <span className="font-serif text-4xl leading-none text-neutral-300">
              05
            </span>
            <div>
              <p className="block text-xs uppercase tracking-[0.2em] text-zinc-500">
                {isHu ? "Elérhetőség" : "Contact details"}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {isHu
                  ? "Írd meg, hogyan szólítsalak, és add meg azt az email címet, ahová válaszolhatok. Telefonszámot vagy WhatsApp elérhetőséget is írhatsz, ha gyorsabb egyeztetésre van szükség. Alkossunk együtt."
                  : "Tell me how to address you and add the email address where I can reply. You can also add a phone or WhatsApp contact if faster coordination would help. Let us create together."}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${id}-name`}
                    className="block text-xs uppercase tracking-[0.16em] text-zinc-500"
                  >
                    {t("name")}
                  </label>
                  <input
                    id={`${id}-name`}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    autoComplete="name"
                    className="mt-3 w-full border-b border-zinc-300 bg-white py-4 text-lg outline-none transition-colors focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${id}-email`}
                    className="block text-xs uppercase tracking-[0.16em] text-zinc-500"
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
                    className="mt-3 w-full border-b border-zinc-300 bg-white py-4 text-lg outline-none transition-colors focus:border-zinc-900"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor={`${id}-phone`}
                  className="block text-xs uppercase tracking-[0.16em] text-zinc-500"
                >
                  {t("phone")}
                </label>
                <input
                  id={`${id}-phone`}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className="mt-3 w-full border-b border-zinc-300 bg-white py-4 text-lg outline-none transition-colors focus:border-zinc-900"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <button
        id="booking-submit"
        type="submit"
        disabled={!isValidForm || isSubmitting}
        className="group relative w-full scroll-mt-40 overflow-hidden bg-neutral-950 px-6 py-6 text-sm uppercase tracking-[0.18em] text-white shadow-[0_24px_70px_rgba(20,20,20,0.22)] transition-all hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_30px_90px_rgba(20,20,20,0.28)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none"
      >
        <span className="relative z-10 flex items-center justify-center gap-4">
          <span>{isSubmitting ? t("sending") : t("send")}</span>
          <span
            aria-hidden="true"
            className="text-lg transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </button>

      <div aria-live="polite">
        {validationError && (
          <p className="text-red-500 text-sm text-center">{validationError}</p>
        )}
      </div>
      </form>
      </div>
    </div>
  );
}
