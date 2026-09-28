"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const signingUp = mode === "sign-up";
  const configured = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = signingUp
        ? await authClient.signUp.email({ name: String(values.get("name")), email: String(values.get("email")), password: String(values.get("password")) })
        : await authClient.signIn.email({ email: String(values.get("email")), password: String(values.get("password")) });
      if (result.error) throw new Error(result.error.message ?? "We couldn't sign you in. Check your details and try again.");
      window.location.assign("/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-art"><div className="auth-art-seal"><Image src="/images/logo.png" alt="IIUI seal" width={140} height={140} /></div></div>
      <div className="auth-form-area"><form className="auth-card" onSubmit={submit}>
        <div className="eyebrow"><span className="eyebrow-line" /> YOUR STUDY SPACE</div>
        <h1>{signingUp ? <>A better way<br />to <em>study together.</em></> : <>Welcome back<br />to <em>your desk.</em></>}</h1>
        <p>{signingUp ? "Create an account to share resources and keep your degree's study materials close." : "Sign in to continue to your IIUI study space."}</p>
        {!configured && <div className="auth-disabled" role="status">Account services are being connected. Your details are not collected until the secure database and sign-in settings are ready.</div>}
        {error && <div className="auth-error" role="alert">{error}</div>}
        <fieldset disabled={!configured || pending} style={{ border: 0, padding: 0, margin: 0 }}>
          {signingUp && <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Your name" /></label>}
          <label>University or personal email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
          <label>Password<input name="password" type="password" autoComplete={signingUp ? "new-password" : "current-password"} minLength={10} required placeholder={signingUp ? "At least 10 characters" : "Your password"} /></label>
          <button className="button-green" type="submit">{pending ? <><LoaderCircle size={15} className="spin" /> Please wait…</> : <>{signingUp ? "Create your account" : "Sign in"} <ArrowRight size={15} /> </>}</button>
        </fieldset>
        <p className="auth-switch">{signingUp ? "Already have an account? " : "New to the desk? "}<Link href={signingUp ? "/auth/sign-in" : "/auth/sign-up"}>{signingUp ? "Sign in" : "Create an account"}</Link></p>
      </form></div>
    </section>
  );
}
