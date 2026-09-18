import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

function profileInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function SiteHeader() {
  const currentUser = await getCurrentUser();

  return (
    <header className="page-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand blue-brand" href="/" aria-label="Save The Beach SL home">
          <span className="brand-mark">STB</span>
          <span>
            Save The Beach
            <br />
            <i>SL</i>
          </span>
        </Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/events">Clean-ups</Link>
          <Link href="/media">Media</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/volunteer">Volunteer</Link>
        </div>
        <div className="nav-actions">
          {currentUser ? (
            <>
              {!currentUser.emailVerified ? (
                <Link className="nav-verify" href="/verify">
                  Verify email
                </Link>
              ) : null}
              {currentUser.role === "ADMIN" ? (
                <Link className="admin-link" href="/admin">
                  Admin
                </Link>
              ) : null}
              <Link className="nav-button" href="/blog/new">
                Write a post
              </Link>
              <Link className="nav-profile" href="/profile" aria-label="View your profile">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="nav-avatar-img" />
                ) : (
                  profileInitials(currentUser.name)
                )}
              </Link>
            </>
          ) : (
            <>
              <Link className="admin-link" href="/login">
                Log in
              </Link>
              <Link className="nav-button" href="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}