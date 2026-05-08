"use client";

import { useId, useState } from "react";

type AboutFeedbackFormProps = {
  contactEmail: string;
  locale: string;
};

export default function AboutFeedbackForm({
  locale,
}: AboutFeedbackFormProps) {
  const isHu = locale === "hu";
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [permission, setPermission] = useState("anonymous");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2 || !email.includes("@") || feedback.trim().length < 20) {
      setError(
        isHu
          ? "Kérlek töltsd ki a nevet, emailt és írj legalább pár mondatot."
          : "Please add your name, email and at least a few sentences.",
      );
      return;
    }

    setError("");
    setIsSubmitting(true);

    const displayPermission =
      permission === "name"
        ? isHu
          ? "kitehető keresztnévvel"
          : "may be shown with first name"
        : isHu
          ? "inkább név nélkül"
          : "anonymous preferred";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: [
            isHu ? "Visszajelzés fotózás után" : "Post-session feedback",
            "",
            `${isHu ? "Megjelenítés" : "Display permission"}: ${displayPermission}`,
            "",
            feedback.trim(),
          ].join("\n"),
        }),
      });

      if (!response.ok) {
        throw new Error("Feedback request failed");
      }

      setSent(true);
    } catch {
      setError(
        isHu
          ? "Nem sikerült elküldeni a visszajelzést. Kérlek próbáld újra, vagy írj közvetlenül emailt."
          : "I could not send the feedback. Please try again or email me directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${id}-name`}
            className="mb-2 block text-xs uppercase tracking-[0.18em] text-neutral-500"
          >
            {isHu ? "Név" : "Name"}
          </label>
          <input
            id={`${id}-name`}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            autoComplete="name"
            className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-950"
          />
        </div>
        <div>
          <label
            htmlFor={`${id}-email`}
            className="mb-2 block text-xs uppercase tracking-[0.18em] text-neutral-500"
          >
            Email
          </label>
          <input
            id={`${id}-email`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-950"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${id}-feedback`}
          className="mb-2 block text-xs uppercase tracking-[0.18em] text-neutral-500"
        >
          {isHu ? "Visszajelzés" : "Feedback"}
        </label>
        <textarea
          id={`${id}-feedback`}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          required
          minLength={20}
          rows={6}
          placeholder={
            isHu
              ? "Miért választottál engem? Milyen volt maga a fotózás? Mit adott a végeredmény?"
              : "Why did you choose me? What did the session feel like? What did the final images give you?"
          }
          className="w-full resize-y border border-neutral-200 bg-white px-4 py-3 text-sm leading-7 outline-none transition-colors focus:border-neutral-950"
        />
      </div>

      <fieldset className="grid gap-3 border border-neutral-200 p-4 sm:grid-cols-2">
        <legend className="px-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
          {isHu ? "Publikálás" : "Publishing"}
        </legend>
        <label className="flex gap-3 text-sm leading-6 text-neutral-600">
          <input
            type="radio"
            name={`${id}-permission`}
            value="anonymous"
            checked={permission === "anonymous"}
            onChange={(event) => setPermission(event.target.value)}
          />
          {isHu ? "Név nélkül kitehető" : "May be shown anonymously"}
        </label>
        <label className="flex gap-3 text-sm leading-6 text-neutral-600">
          <input
            type="radio"
            name={`${id}-permission`}
            value="name"
            checked={permission === "name"}
            onChange={(event) => setPermission(event.target.value)}
          />
          {isHu ? "Keresztnévvel kitehető" : "May be shown with first name"}
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-neutral-950 px-6 py-4 text-sm uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 sm:w-auto"
      >
        {isSubmitting
          ? isHu
            ? "Küldés..."
            : "Sending..."
          : isHu
            ? "Visszajelzést küldök"
            : "Send feedback"}
      </button>

      <div aria-live="polite">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {sent && !error && (
          <p className="text-sm leading-6 text-neutral-500">
            {isHu
              ? "Köszönöm, a visszajelzésed megérkezett hozzám."
              : "Thank you, your feedback has arrived."}
          </p>
        )}
      </div>
    </form>
  );
}
