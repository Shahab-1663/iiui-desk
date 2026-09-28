import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "IIUI Student Desk — Your next semester, sorted", template: "%s · IIUI Student Desk" },
  description: "Explore the IIUI faculty atlas, find course resources, plan your CGPA and build a better study rhythm with tools made for students.",
  applicationName: "IIUI Student Desk",
  openGraph: { title: "IIUI Student Desk — Your next semester, sorted", description: "IIUI course resources, a faculty atlas and useful tools for university life.", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#123f35",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}><div className="announcement"><span className="announcement-dot" />A student powered index of IIUI</div><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
