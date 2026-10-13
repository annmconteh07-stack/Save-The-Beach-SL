import Link from "next/link";

import BrandMark from "@/components/brand-mark";
import { logoutAction } from "@/lib/actions";
import { getCurrentUser, isVolunteerAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function roleLabel(role: string) {
  if (role === "VOLUNTEER_ADMIN") return "Volunteer Admin";
  if (role === "ADMIN") return "Super Admin";
  return "Admin";
}

export default async function VolunteerAdminLayoutShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const [currentUser, volunteerCount, registrationCount, eventCount, pendingCount, teamCount] =
    await Promise.all([
      getCurrentUser().catch(() => null),
      prisma.volunteer.count().catch(() => 0),
      prisma.registration.count().catch(() => 0),
      prisma.event.count().catch(() => 0),
      prisma.post.count({ where: { status: "PENDING" } }).catch(() => 0),
      prisma.teamMember.count().catch(() => 0),
    ]);

  if (!isVolunteerAdmin(currentUser)) {
    return (
      <main className="page-shell auth-shell">
        <div className="auth-card">
          <p className="section-kicker blue-kicker">
            <span>!</span> Restricted
          </p>
          <h1>Volunteer admin only.</h1>
          <p className="form-message">
            This area is for the volunteer admin team. Please log in with a volunteer admin account.
          </p>
          <Link className="blue-button auth-button" href="/volunteer-admin/login?next=%2Fvolunteer-admin">
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
          <Link href="/volunteer-admin" className={title === "Overview" ? "active" : ""}>
            Overview
          </Link>
          <Link href="/volunteer-admin/events" className={title === "Events" ? "active" : ""}>
            Events
          </Link>
          <Link href="/volunteer-admin/stats" className={title === "Impact stats" ? "active" : ""}>
            Impact stats
          </Link>
          <Link href="/volunteer-admin/posts" className={title === "Blog" ? "active" : ""}>
            Blog
          </Link>
          <Link href="/volunteer-admin/volunteers" className={title === "Volunteers" ? "active" : ""}>
            Volunteers
          </Link>
          <Link href="/volunteer-admin/team" className={title === "Team" ? "active" : ""}>
            Team
          </Link>
          {currentUser!.role === "ADMIN" ? (
            <Link href="/volunteer-admin/members" className={title === "Members" ? "active" : ""}>
              Members
            </Link>
          ) : null}
        </nav>
        {currentUser!.role === "ADMIN" ? (
          <Link className="back-home" href="/media-admin">
            Media portal
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
            <span>Team members</span>
            <strong>{teamCount}</strong>
            <small>on the About page</small>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}