"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { brief, site } from "@/content/site";

type Status = "idle" | "sending" | "done" | "error";
type Field = "name" | "company" | "goal" | "email";

const { form } = brief;

/** Measures a value in the input's own font so each blank grows with what's typed into it. */
function fitWidth(input: HTMLInputElement) {
  const canvas = fitWidth.canvas ?? (fitWidth.canvas = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const cs = getComputedStyle(input);
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const text = input.value || input.placeholder;
  const width = ctx.measureText(text).width + parseFloat(cs.fontSize) * 0.14;
  input.style.width = `${Math.ceil(width)}px`;
}
fitWidth.canvas = null as HTMLCanvasElement | null;

function Blank({
  name,
  type = "text",
  autoComplete,
  value,
  onChange,
  inputRef,
}: {
  name: Field;
  type?: string;
  autoComplete: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputRef?: (el: HTMLInputElement | null) => void;
}) {
  return (
    <label className="blank">
      <span className="sr-only">{form.placeholders[name]}</span>
      <input
        ref={(el) => {
          if (el) fitWidth(el);
          inputRef?.(el);
        }}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        placeholder={form.placeholders[name]}
        value={value}
        onChange={onChange}
        spellCheck={type === "email" ? false : undefined}
      />
    </label>
  );
}

export default function BriefForm() {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", company: "", goal: "", email: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [problem, setProblem] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    fitWidth(e.target);
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setProblem("");
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot.current?.value ?? "" }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setProblem(data.error ?? "");
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch {
      setStatus("error");
    }
    statusRef.current?.focus({ preventScroll: true });
  };

  if (status === "done") {
    return (
      <p className="brief__done" ref={statusRef} tabIndex={-1} role="status">
        {form.done}
      </p>
    );
  }

  return (
    <form className="madlib" onSubmit={submit} noValidate={false} data-rise-in>
      <p className="madlib__copy">
        {form.hi} <Blank name="name" autoComplete="name" value={values.name} onChange={change} /> {form.from}{" "}
        <Blank name="company" autoComplete="organization" value={values.company} onChange={change} />.{" "}
        {form.grow} <Blank name="goal" autoComplete="off" value={values.goal} onChange={change} />. {form.reach}{" "}
        <Blank name="email" type="email" autoComplete="email" value={values.email} onChange={change} />.
      </p>

      {/* Honeypot */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Website
          <input ref={honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="madlib__foot">
        <button className="btn btn--big" type="submit" disabled={status === "sending"} data-magnetic>
          <span>{status === "sending" ? form.sending : form.submit}</span>
        </button>
        <p className="madlib__alt">
          {brief.alt} <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>

      {status === "error" && (
        <p className="madlib__error" role="alert" ref={statusRef} tabIndex={-1}>
          {problem || (
            <>
              {form.error} <a href={`mailto:${site.email}`}>{site.email}</a>.
            </>
          )}
        </p>
      )}
    </form>
  );
}
