import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Contact" };
export const dynamic = "force-dynamic";
export default function ContactPage() {
  return <>
    <section className="page-hero contact-hero"><div className="eyebrow"><span className="eyebrow-line" /> GET IN TOUCH</div><h1>We'd love to<br />hear <em>from you.</em></h1><p>Ideas, corrections, kind words or a question — there's room for all of it.</p><div className="page-hero-decoration">✳</div></section>
    <section className="contact-layout"><div className="contact-intro"><span className="strip-kicker">A NOTE TO THE DESK</span><h2>Help us make this<br />space <em>better.</em></h2><p>Student Desk is a work in progress. Tell us what would help you find the right material, or let us know when something needs a second look.</p><div className="contact-detail"><span>✉</span><div><strong>Reach the project team</strong><small>Your note goes to the desk inbox.</small></div></div><a className="official-link" href="https://www.iiu.edu.pk/" target="_blank" rel="noreferrer">Visit the official IIUI website <ExternalLink size={12} /></a></div><ContactForm /></section>
  </>;
}
