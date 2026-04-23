"use client";

import { useState } from "react";
import { client } from "@/sanity/lib/client";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">Kapcsolat</h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Vedd fel velem a kapcsolatot
        </p>
      </section>
      <section className="max-w-2xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl font-serif mb-8">Elérhetőségek</h2>
            <div className="space-y-4 text-zinc-600 text-sm">
              <p>✉ richard@example.com</p>
              <p>✆ +36 30 123 4567</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-serif mb-8">Írj nekem</h2>
            {status === "success" ? (
              <div className="border border-zinc-200 p-8 text-center">
                <p className="font-serif text-xl mb-2">Köszönöm!</p>
                <p className="text-zinc-500 text-sm">
                  Hamarosan felveszem veled a kapcsolatot.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Neved"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email címed"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
                />
                <textarea
                  placeholder="Üzeneted"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors resize-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-zinc-900 text-white py-3 text-sm tracking-widest hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  {status === "loading" ? "KÜLDÉS..." : "KÜLDÉS"}
                </button>
                {status === "error" && (
                  <p className="text-red-500 text-sm text-center">
                    Hiba történt, próbáld újra.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
