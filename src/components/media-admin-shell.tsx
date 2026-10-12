import Link from "next/link";

import BrandMark from "@/components/brand-mark";
import { logoutAction } from "@/lib/actions";
import { getCurrentUser, isMediaAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function roleLabel(role: string) {
  if (role === "MEDIA_ADMIN") return "Media Admin";
  if (role === "ADMIN") return "Super Admin";
  return "Admin";
}

export default async function MediaAdminLayoutShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const [currentUser, totalCount, photoCount, videoCount] = await Promise.all([
    getCurrentUser().catch(() => null),
    prisma.media.count().catch(() => 0),
    prisma.media.count({ where: { type: "PHOTO" } }).catch(() => 0),
    prisma.media.count({ where: { type: "VIDEO" } }).catch(() => 0),
  ]);

  if (!isMediaAdmin(currentUser)) {
    return (
      <main className="page-shell auth-shell">
        <div className="auth-card">
          <p className="section-kicker blue-kicker">
            <span>!</span> Restricted
          </p>
          <h1>Media admin only.</h1>
          <p className="form-message">
            This area is for the media admin team. Please log in with a media admin account.
          </p>
          <Link className="blue-button auth-button" href="/media-admin/login?next=%2Fmedia-admin">
            Log in
          </Link>
          <Link className="back-link" href="/">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link className="brand blue-brand" href="/">
          <BrandMark />
          <span>
            Save The Beach
            <br />
            <i>SL</i>
          </span>
        </Link>
        <div className="admin-user">
          <span>A</span>
          <div>
            <strong>{roleLabel(currentUser!.role)}</strong>
            <small>{currentUser!.email}</small>
          </div>
        </div>
        <nav>
          <Link href="/media-admin" className={title === "Media" ? "active" : ""}>
            Media
          </Link>
        </nav>
        {currentUser!.role === "ADMIN" ? (
          <Link className="back-home" href="/volunteer-admin">
            Volunteer portal
          </Link>
        ) : null}
        <Link className="back-home" href="/">
          Back to website
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="back-home admin-logout">
            Log out
          </button>
        </form>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">
              {new Intl.DateTimeFormat("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date())}
            </p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <span className="admin-avatar">A</span>
        </header>

        <div className="admin-stats">
          <div>
            <span>Media items</span>
            <strong>{totalCount}</strong>
            <small>in the gallery</small>
          </div>
          <div>
            <span>Photos</span>
            <strong>{photoCount}</strong>
            <small>ready to post</small>
          </div>
          <div>
            <span>Videos</span>
            <strong>{videoCount}</strong>
            <small>recorded at clean-ups</small>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}