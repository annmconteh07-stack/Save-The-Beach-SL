import Link from "next/link";

import { events } from "@/app/lib/site-data";

export default function EventsPage() {
  return (
    <main className="page-shell">
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
            <Link href="/about">About</Link>
            <Link href="/events">Clean-ups</Link>
            <Link href="/blog">Journal</Link>
          </div>
          <div className="nav-actions">
            <Link className="admin-link" href="/admin">
              Admin portal <span>↗</span>
            </Link>
            <Link className="nav-button" href="/blog/new">
              Submit a story
            </Link>
          </div>
        </nav>
      </header>

      <section className="page-hero">
        <div className="content-width page-hero-inner">
          <p className="eyebrow blue-eyebrow">Upcoming clean-ups</p>
          <h1>
            Join the next <em>coastline reset.</em>
          </h1>
          <p>Bring gloves, bring energy, and help keep our shoreline clean and alive.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-width list-stack">
          {events.map((event) => (
            <article key={event.id} className="event-listing-card">
              <div className="event-date-block">
                <strong>{event.day}</strong>
                <span>{event.month}</span>
              </div>
              <div className="event-summary">
                <p className="event-label">Community clean-up</p>
                <h2>{event.title}</h2>
                <p>
                  {event.location} · {event.time}
                </p>
                <small>{event.description}</small>
              </div>
              <div className="event-actions">
                <span>{event.spotsLeft} spots left</span>
                <Link href={`/events/${event.id}`}>
                  View details <b>↗</b>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
