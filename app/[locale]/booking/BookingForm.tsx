"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type ServiceOption = {
  _id: string;
  title: string;
};

export default function BookingForm({
  services,
}: {
  services: ServiceOption[];
}) {
  const t = useTranslations("booking");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [validationError, setValidationError] = useState("");

  const isValidForm =
    name.trim().length >= 2 && email.includes("@") && service.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidForm) {
      setValidationError(t("validationError"));
      return;
    }

    setValidationError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, date, message }),
      });

      if (res.ok) {
        setStatus("success");
        // űrlap törlése
        setName("");
        setEmail("");
        setPhone("");
        setService("");
        setDate("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
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
      {/* ... a többi mező ugyanaz marad ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-[0.2em] text-zinc-500 mb-2">
            {t("name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border-b border-zinc-300 py-4 text-lg focus:border-zinc-900 outline-none"
            placeholder="Teljes név"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] text-zinc-500 mb-2">
            {t("email")}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-b border-zinc-300 py-4 text-lg focus:border-zinc-900 outline-none"
            placeholder="email@pelda.hu"
          />
        </div>
      </div>

      {/* telefon + dátum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-[0.2em] text-zinc-500 mb-2">
            {t("phone")}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border-b border-zinc-300 py-4 text-lg focus:border-zinc-900 outline-none"
            placeholder="+36 30 123 4567"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] text-zinc-500 mb-2">
            {t("date")}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-b border-zinc-300 py-4 text-lg focus:border-zinc-900 outline-none"
          />
        </div>
      </div>

      {/* szolgáltatás */}
      <div>
        <label className="block text-xs tracking-[0.2em] text-zinc-500 mb-2">
          {t("service")}
        </label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
          className="w-full border-b border-zinc-300 py-4 text-lg focus:border-zinc-900 outline-none bg-white"
        >
          <option value="">{t("selectPackage")}</option>
          {services.map((s) => (
            <option key={s._id} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value={t("other")}>{t("other")}</option>
        </select>
      </div>

      {/* megjegyzés */}
      <div>
        <label className="block text-xs tracking-[0.2em] text-zinc-500 mb-2">
          {t("message")}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full border-b border-zinc-300 py-4 text-lg focus:border-zinc-900 outline-none resize-y"
          placeholder="Írd le röviden..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading" || !isValidForm}
        className="w-full border border-zinc-900 py-5 text-sm tracking-[0.15em] hover:bg-zinc-900 hover:text-white disabled:opacity-50 transition-all"
      >
        {status === "loading" ? t("sending") : t("send")}
      </button>

      {validationError && (
        <p className="text-red-500 text-sm text-center">{validationError}</p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-sm text-center">{t("error")}</p>
      )}
    </form>
  );
}
