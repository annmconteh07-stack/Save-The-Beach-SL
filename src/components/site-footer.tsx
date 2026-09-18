import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

export default async function SiteFooter() {
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <footer className="site-footer" id="about">
      <div className="content-width footer-grid">
        <div className="brand blue-brand">
          <span className="brand-mark">STB</span>
          <span>
            Save The Beach
            <br />
            <i>SL</i>
          </span>
        </div>
        <p>
          For the love of our coast,
          <br />
          and everyone who calls it home.
        </p>
        <div className="footer-links">
          <a href="mailto:hello@savethebeach.sl">hello@savethebeach.sl</a>
          <Link href="/volunteer">Register as a volunteer</Link>
          <Link href="/media">Media gallery</Link>
          <Link href="/blog">Community blog</Link>
          {isAdmin ? <Link href="/admin">Admin portal ↗</Link> : null}
        </div>
        <small>© 2026 Save The Beach SL</small>
      </div>
    </footer>
  );
}