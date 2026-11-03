import { NextResponse } from "next/server";

type Payload = Partial<Record<"name" | "email" | "company" | "subject" | "message", unknown>>;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Stub endpoint: validates the submission and logs it.
 * Swap the console.info for your delivery of choice (Resend, a CRM webhook, Sheets…).
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const submission = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    company: clean(body.company, 160),
    subject: clean(body.subject, 200),
    message: clean(body.message, 5000),
  };

  if (!submission.name || !submission.message) {
    return NextResponse.json({ error: "Please add your name and a message." }, { status: 422 });
  }
  if (!EMAIL.test(submission.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  console.info("[contact] new submission", submission);
  return NextResponse.json({ ok: true });
}
