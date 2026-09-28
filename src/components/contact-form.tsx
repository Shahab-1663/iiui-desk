"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; message: string }>();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setNotice(undefined);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Message could not be sent.");
      form.reset();
      setNotice({ type: "ok", message: "Thanks — your note is safely in the desk inbox." });
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Message could not be sent." });
    } finally { setPending(false); }
  }

  return <form className="contact-form" onSubmit={submit}>
    <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="What should we call you?" /></label>
    <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
    <label>What is this about?<select name="topic"><option>General feedback</option><option>Report an issue</option><option>Resource contribution</option><option>Something else</option></select></label>
    <label>Your message<textarea name="message" rows={5} minLength={10} maxLength={2500} required placeholder="Tell us a little more…" /></label>
    {notice && <div className={notice.type === "ok" ? "upload-success" : "auth-error"} role="status">{notice.type === "ok" && <Check size={15} />}{notice.message}</div>}
    <button className="button-green" type="submit" disabled={pending}>{pending ? <><LoaderCircle size={15} className="spin" /> Sending…</> : <>Send your note <ArrowRight size={15} /></>}</button>
  </form>;
}

