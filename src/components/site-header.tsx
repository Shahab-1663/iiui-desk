"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Plus, X, Wrench } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Discover" },
  { href: "/faculties", label: "Faculties" },
  { href: "/resources", label: "Resources" },
  { href: "/tools", label: "Student tools" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const enabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

  return (
    <header className="site-header">
      <Link className="brand" href="/" onClick={() => setOpen(false)} aria-label="IIUI Student Desk home">
        <span className="brand-seal"><Image src="/images/logo.png" alt="" width={37} height={37} /></span>
        <span className="brand-type"><strong>Student Desk</strong><small>INTERNATIONAL ISLAMIC UNIVERSITY</small></span>
      </Link>
      <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`main-nav ${open ? "open" : ""}`} aria-label="Main navigation">
        {links.map((link) => <Link key={link.href} className={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) ? "nav-link active" : "nav-link"} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
        <Link className="nav-upload" href="/upload" onClick={() => setOpen(false)}><Plus size={15} /> Share a resource</Link>
        {enabled ? <AuthActions closeMenu={() => setOpen(false)} /> : <Link className="nav-signin" href="/auth/sign-in" onClick={() => setOpen(false)}>Sign in <span aria-hidden="true">↗</span></Link>}
      </nav>
    </header>
  );
}

function AuthActions({ closeMenu }: { closeMenu: () => void }) {
  const { data: session } = authClient.useSession();
  if (session?.user) return <><Link className="nav-link admin-nav" href="/admin" onClick={closeMenu}><Wrench size={13} /> Desk admin</Link><button className="nav-signin" onClick={() => void authClient.signOut()} type="button">Sign out</button></>;
  return <Link className="nav-signin" href="/auth/sign-in" onClick={closeMenu}>Sign in <span aria-hidden="true">↗</span></Link>;
}
