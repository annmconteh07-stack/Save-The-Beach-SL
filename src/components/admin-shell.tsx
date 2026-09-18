import Link from "next/link";

import { logoutAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminLayoutShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const [currentUser, volunteerCount, registrationCount, eventCount, pendingCount, mediaCount] =
    await Promise.all([
      getCurrentUser(),
      prisma.volunteer.count(),
      prisma.registration.count(),
      prisma.event.count(),
      prisma.post.count({ where: { status: "PENDING" } }),
      prisma.media.count(),
    ]);

  const isAdmin = !!(currentUser && currentUser.role === "ADMIN");

  if (!isAdmin) {
    return (
      <main className="page-shell auth-shell">
        <div className="auth-card">
          <p className="section-kicker blue-kicker">
            <span>!</span> Restricted
          </p>
          <h1>Admin only.</h1>
          <p className="form-message">
            This area is for the Save The Beach SL admin team. Please log in with an admin account.
          </p>
          <Link className="blue-button auth-button" href="/login?next=%2Fadmin">
            Log in <span>↗</span>
          </Link>
          <Link className="back-link" href="/">
            ← Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link className="brand blue-brand" href="/">
          <span className="brand-mark">STB</span>
          <span>
            Save The Beach
            <br />
            <i>SL</i>
          </span>
        </Link>
        <div className="admin-user">
          <span>A</span>
          <div>
            <strong>Admin</strong>
            <small>{currentUser!.email}</small>
          </div>
        </div>
        <nav>
          <Link href="/admin" className={title === "Overview" ? "active" : ""}>
            Overview
          </Link>
          <Link href="/admin/events" className={title === "Events" ? "active" : ""}>
            Events
          </Link>
          <Link href="/admin/media" className={title === "Media" ? "active" : ""}>
            Media
          </Link>
          <Link href="/admin/posts" className={title === "Blog" ? "active" : ""}>
            Blog
          </Link>
          <Link href="/admin/volunteers" className={title === "Volunteers" ? "active" : ""}>
            Volunteers
          </Link>
        </nav>
        <Link className="back-home" href="/">
          ← Back to website
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
            <span>Volunteers</span>
            <strong>{volunteerCount + registrationCount}</strong>
            <small>from signups and event registrations</small>
          </div>
          <div>
            <span>Upcoming events</span>
            <strong>{eventCount}</strong>
            <small>live on the site</small>
          </div>
          <div>
            <span>Posts awaiting review</span>
            <strong>{pendingCount}</strong>
            {pendingCount > 0 ? <small className="attention">Needs your attention</small> : <small>All caught up</small>}
          </div>
          <div>
            <span>Media items</span>
            <strong>{mediaCount}</strong>
            <small>in the gallery</small>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}