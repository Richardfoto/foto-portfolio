export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type BookingPayload = {
  name: string;
  email: string;
  phone?: string;
  service: string;
  date?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactPayload(input: unknown) {
  const payload = (input ?? {}) as Record<string, unknown>;
  const name = normalizeString(payload.name);
  const email = normalizeString(payload.email);
  const message = normalizeString(payload.message);

  if (!name || !email || !message) {
    return { ok: false as const, error: "MISSING_FIELDS" };
  }

  if (!emailPattern.test(email)) {
    return { ok: false as const, error: "INVALID_EMAIL" };
  }

  if (name.length < 2 || message.length < 10) {
    return { ok: false as const, error: "INVALID_CONTENT" };
  }

  return {
    ok: true as const,
    data: { name, email, message } satisfies ContactPayload,
  };
}

export function validateBookingPayload(input: unknown) {
  const payload = (input ?? {}) as Record<string, unknown>;
  const name = normalizeString(payload.name);
  const email = normalizeString(payload.email);
  const phone = normalizeString(payload.phone);
  const service = normalizeString(payload.service);
  const date = normalizeString(payload.date);
  const message = normalizeString(payload.message);

  if (!name || !email || !service) {
    return { ok: false as const, error: "MISSING_FIELDS" };
  }

  if (!emailPattern.test(email)) {
    return { ok: false as const, error: "INVALID_EMAIL" };
  }

  if (name.length < 2) {
    return { ok: false as const, error: "INVALID_NAME" };
  }

  if (date) {
    const selectedDate = new Date(date);
    if (Number.isNaN(selectedDate.getTime())) {
      return { ok: false as const, error: "INVALID_DATE" };
    }
  }

  return {
    ok: true as const,
    data: { name, email, phone, service, date, message } satisfies BookingPayload,
  };
}

