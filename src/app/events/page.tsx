import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const gradients = [
  "linear-gradient(150deg, #0a7bb3, #075a88)",
  "linear-gradient(150deg, #17b696, #0e8c73)",
  "linear-gradient(150deg, #ffd166, #ffa84d)",
  "linear-gradient(150deg, #ff8fa3, #e86d88)",
  "linear-gradient(150deg, #7f86ff, #5f66de)",
  "linear-gradient(150deg, #2ec8c0, #17a8a0)",
];

const accents = ["var(--blue)", "var(--teal)", "var(--sun)", "var(--pink)", "var(--grape)", "var(--aqua)"];

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    include: {
      registrations: true,
    },
  });

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="fun-hero blob-field">
        <span className="blob blob-sun" />
        <span className="blob blob-aqua" />
        <div className="content-width">
          <span className="pill pill-aqua">Upcoming clean-ups</span>
          <h1 style={{ maxWidth: 880 }}>
            Join the next <em>coastline reset.</em>
          </h1>
          <p className="lead">
            Bring gloves, bring energy, and help keep our shoreline clean and alive.
          </p>
          <div className="hero-tags">
            <span className="pill pill-sun">{events.length} events scheduled</span>
            <span className="pill pill-teal">All welcome</span>
          </div>
        </div>
      </section>

      <section className="band band-ice">
        <div className="content-width list-stack">
          {events.map((event, index) => {
            const spotsLeft =
              event.capacityLimit > 0 ? Math.max(event.capacityLimit - event.registrations.length, 0) : null;
            const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(event.date);
            const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(event.date).toUpperCase();

            return (
              <article
                key={event.id}
                className="event-fun"
                style={{ ["--accent" as string]: accents[index % accents.length] }}
              >
                <div className="event-fun-date" style={{ background: gradients[index % gradients.length] }}>
                  <strong>{day}</strong>
                  <span>{month}</span>
                </div>
                <div className="event-summary">
                  <span className="pill pill-outline">Community clean-up</span>
                  <h2>{event.title}</h2>
                  <p>
                    {event.location} ·{" "}
                    {new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit" }).format(event.date)}
                  </p>
                  <small>{event.description}</small>
                </div>
                <div className="event-actions">
                  <span>{spotsLeft === null ? "Open to all" : `${spotsLeft} spots left`}</span>
                  <Link href={`/events/${event.id}`}>
                    View details <b>↗</b>
                  </Link>
                </div>
              </article>
            );
          })}
          {events.length === 0 ? (
            <p className="empty-state">No upcoming clean-ups right now. Check back soon.</p>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
