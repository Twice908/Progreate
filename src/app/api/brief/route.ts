import { NextResponse } from "next/server";

type Payload = Partial<Record<"name" | "company" | "goal" | "email" | "website", unknown>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/**
 * Receives the brief from the contact form.
 *
 * TODO before launch: this validates and logs but does not deliver anything. Replace the
 * console.info with your email service or CRM so that submissions actually reach you.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a field real visitors never see. Bots get a polite success and nothing happens.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const brief = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    goal: clean(body.goal, 400),
    email: clean(body.email, 200),
  };

  if (!brief.name || !brief.goal) {
    return NextResponse.json({ error: "Please add your name and what you want to grow." }, { status: 422 });
  }
  if (!EMAIL.test(brief.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  console.info("[brief] received", brief);
  return NextResponse.json({ ok: true });
}
