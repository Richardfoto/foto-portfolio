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

  function isValidForm() {
    return (
      name.trim().length >= 2 &&
      email.includes("@") &&
      service.trim().length > 0
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidForm()) {
      setValidationError(t("validationError"));
      return;
    }

    setValidationError("");
    setStatus("loading");
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        service,
        date,
        message,
      }),
    });
    if (res.ok) {
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setService("");
      setDate("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-zinc-200 p-12 text-center">
        <p className="font-serif text-2xl mb-4">{t("successTitle")}</p>
        <p className="text-zinc-500">{t("successMessage")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs tracking-widest text-zinc-400 mb-2">
            {t("name").toUpperCase()}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest text-zinc-400 mb-2">
            {t("email").toUpperCase()}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs tracking-widest text-zinc-400 mb-2">
            {t("phone").toUpperCase()}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest text-zinc-400 mb-2">
            {t("date").toUpperCase()}
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs tracking-widest text-zinc-400 mb-2">
          {t("service").toUpperCase()}
        </label>
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
          className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors bg-white"
        >
          <option value="">{t("selectPackage")}</option>
          {services.map((serviceOption) => (
            <option key={serviceOption._id} value={serviceOption.title}>
              {serviceOption.title}
            </option>
          ))}
          <option value={t("other")}>{t("other")}</option>
        </select>
      </div>
      <div>
        <label className="block text-xs tracking-widest text-zinc-400 mb-2">
          {t("message").toUpperCase()}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-zinc-900 text-white py-4 text-sm tracking-widest hover:bg-zinc-700 transition-colors disabled:opacity-50"
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
