"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/lib/data";
import { Arrow } from "@/components/ui/Icons";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-white/[0.07] bg-surface px-5 py-3.5 text-[14px] leading-[19.6px] tracking-[-0.02em] text-white placeholder:text-white/30 outline-none transition-[border-color,box-shadow] duration-300 focus:border-ember/60 focus:shadow-[0_0_0_3px_rgb(250_97_20/0.15)]";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate={false}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {contact.form.fields.map((f) => (
          <label key={f.name} className="flex flex-col gap-2.5">
            <span className="text-[14px] leading-[19.6px] tracking-[-0.02em] text-white/80">{f.label}</span>
            <input name={f.name} type={f.type} placeholder={f.placeholder} required={f.name === "name" || f.name === "email"} className={field} autoComplete="off" />
          </label>
        ))}
      </div>

      <label className="flex flex-col gap-2.5">
        <span className="text-[14px] leading-[19.6px] tracking-[-0.02em] text-white/80">{contact.form.message.label}</span>
        <textarea name="message" rows={6} required placeholder={contact.form.message.placeholder} className={`${field} min-h-[150px] resize-y`} />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn-ember group disabled:opacity-60">
          <span>{status === "sending" ? "Sending…" : contact.form.submit}</span>
          <Arrow className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
        <p role="status" aria-live="polite" className={`text-[14px] tracking-[-0.02em] ${status === "error" ? "text-[#ff7a6b]" : "text-white/70"}`}>
          {status === "sent" && "Thanks — your message is in. We'll be in touch soon."}
          {status === "error" && error}
        </p>
      </div>
    </form>
  );
}
