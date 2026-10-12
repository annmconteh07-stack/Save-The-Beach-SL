"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Clean-ups" },
  { href: "/media", label: "Media" },
  { href: "/blog", label: "Blog" },
  { href: "/volunteer", label: "Volunteer" },
];

export default function MobileNav({
  isLoggedIn = false,
  role = null,
}: {
  isLoggedIn?: boolean;
  role?: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <div
        id="mobile-nav-panel"
        className={`mobile-nav-panel${open ? " open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Mobile navigation">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {role === "MEDIA_ADMIN" ? (
            <Link href="/media-admin" onClick={() => setOpen(false)}>
              Media admin portal
            </Link>
          ) : role === "VOLUNTEER_ADMIN" || role === "ADMIN" ? (
            <Link href="/volunteer-admin" onClick={() => setOpen(false)}>
              {role === "ADMIN" ? "Admin portal" : "Volunteer admin portal"}
            </Link>
          ) : null}
          {isLoggedIn ? (
            <Link href="/profile" onClick={() => setOpen(false)}>
              My profile
            </Link>
          ) : (
            <>
              <Link href="/login" className="mobile-nav-login" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/signup" className="mobile-nav-signup" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
