import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "IIUI Student Desk — Your study space", template: "%s · IIUI Student Desk" },
  description: "Find notes, past papers and course resources for your IIUI degree, or share the material that helped you.",
  applicationName: "IIUI Student Desk",
  openGraph: { title: "IIUI Student Desk", description: "A shared study space for the IIUI community.", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#123f35",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}><div className="announcement"><span className="announcement-dot" />A better study space, built by students for students<Link className="announcement-link" href="/faculties">Explore faculties <span aria-hidden="true">↗</span></Link></div><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}

