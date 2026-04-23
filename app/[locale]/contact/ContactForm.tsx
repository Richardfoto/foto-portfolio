"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || !email.includes("@") || message.trim().length < 10) {
      setValidationError(t("validationError"));
      return;
    }

    setValidationError("");
    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-zinc-200 p-8 text-center">
        <p className="font-serif text-xl mb-2">{t("success_title")}</p>
        <p className="text-zinc-500 text-sm">{t("success_message")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder={t("name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
      />
      <input
        type="email"
        placeholder={t("email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
      />
      <textarea
        placeholder={t("message")}
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        minLength={10}
        className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-zinc-900 text-white py-3 text-sm tracking-widest hover:bg-zinc-700 transition-colors disabled:opacity-50"
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
