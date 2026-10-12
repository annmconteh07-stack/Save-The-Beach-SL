import Link from "next/link";

import BrandMark from "@/components/brand-mark";
import { getCurrentUser } from "@/lib/auth";

export default async function SiteFooter() {
  let currentUser = null;
  try {
    currentUser = await getCurrentUser();
  } catch {
    currentUser = null;
  }

  return (
    <footer className="site-footer" id="about">
      <div className="content-width footer-grid">
        <div className="brand blue-brand">
          <BrandMark />
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
        </div>
        <small>© 2026 Save The Beach SL</small>
      </div>
    </footer>
  );
}