"use client";

import { useEffect, useState } from "react";

const settings = [
  { aperture: "F/1.4", shutter: "1/125", iso: "ISO/200" },
  { aperture: "F/2.0", shutter: "1/250", iso: "ISO/400" },
  { aperture: "F/2.8", shutter: "1/500", iso: "ISO/800" },
  { aperture: "F/4", shutter: "1/60", iso: "ISO/1600" },
] as const;

type CameraSettingsTickerProps = {
  locale: string;
};

export default function CameraSettingsTicker({
  locale,
}: CameraSettingsTickerProps) {
  const [index, setIndex] = useState(0);
  const current = settings[index];
  const labels =
    locale === "hu"
      ? ["Rekesz", "Záridő", "Érzékenység"]
      : ["Aperture", "Shutter", "Sensitivity"];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % settings.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-3 border-y border-white/18 text-center">
      {[
        [current.aperture, labels[0]],
        [current.shutter, labels[1]],
        [current.iso, labels[2]],
      ].map(([value, label], cellIndex) => (
        <div
          key={label}
          className={`${cellIndex === 1 ? "border-x border-white/18" : ""} py-4`}
        >
          <p className="font-serif text-2xl md:text-3xl" aria-live="polite">
            {value}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/45 md:text-[11px] md:tracking-[0.2em]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
