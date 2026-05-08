"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";

type ContactFormProps = {
  contactEmail: string;
  locale: string;
};

export default function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contact");
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || !email.includes("@") || message.trim().length < 10) {
      setValidationError(t("validationError"));
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setStatus("success");
    } catch {
      setValidationError(
        locale === "hu"
          ? "Nem sikerült elküldeni az üzenetet. Kérlek próbáld újra, vagy írj közvetlenül emailt."
          : "I could not send the message. Please try again or email me directly.",
      );
    } finally {
      setIsSubmitting(false);
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor={`${id}-name`} className="mb-2 block text-sm text-zinc-600">
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
          className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
        />
      </div>
      <div>
        <label htmlFor={`${id}-email`} className="mb-2 block text-sm text-zinc-600">
          {t("email")}
        </label>
        <input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
        />
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="mb-2 block text-sm text-zinc-600">
          {t("message")}
        </label>
        <textarea
          id={`${id}-message`}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors resize-y"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-zinc-900 py-3 text-sm tracking-widest text-white transition-colors hover:bg-zinc-700"
      >
        {isSubmitting ? t("sending") : t("send")}
      </button>
      <div aria-live="polite">
        {validationError && (
          <p className="text-red-500 text-sm text-center">{validationError}</p>
        )}
      </div>
    </form>
  );
}
