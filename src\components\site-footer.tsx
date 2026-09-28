import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand footer-brand" href="/">
          <span className="brand-seal"><Image src="/images/logo.png" alt="" width={37} height={37} /></span>
          <span className="brand-type"><strong>Student Desk</strong><small>INTERNATIONAL ISLAMIC UNIVERSITY</small></span>
        </Link>
        <p>A shared study space for the IIUI community.<br />Learn well. Share what helps.</p>
        <div className="footer-links"><Link href="/faculties">Faculty atlas</Link><Link href="/resources">Study library</Link><Link href="/tools">Student tools</Link><Link href="/about">Our story</Link><Link href="/contact">Get in touch</Link><a href="https://www.iiu.edu.pk/" target="_blank" rel="noreferrer">IIUI official site ↗</a></div>
      </div>
      <div className="footer-bottom"><span>INDEPENDENT STUDENT PROJECT · ISLAMABAD, PAKISTAN</span><span>© {new Date().getFullYear()} IIUI Student Desk</span></div>
    </footer>
  );
}
