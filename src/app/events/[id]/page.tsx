import Link from "next/link";
import { notFound } from "next/navigation";

import { events } from "@/app/lib/site-data";
import EventRegistrationForm from "@/components/event-registration-form";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = events.find((item) => item.id === id);

  if (!event) {
    notFound();
  }

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
            <Link className="nav-button" href="/events">
              Join a clean-up
            </Link>
          </div>
        </nav>
      </header>

      <section className="page-hero page-hero-alt">
        <div className="content-width page-hero-inner narrow-copy">
          <p className="eyebrow blue-eyebrow">Community clean-up</p>
          <h1>{event.title}</h1>
          <p>
            {event.location} · {event.time}
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-width event-detail-grid">
          <div>
            <p className="section-kicker blue-kicker">
              <span>01</span> Event overview
            </p>
            <p>{event.longDescription}</p>
            <ul className="detail-list">
              {event.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <aside className="event-signup-card">
            <p className="card-label">Volunteer registration</p>
            <div className="event-meta-row">
              <span>Date</span>
              <strong>{event.date}</strong>
            </div>
            <div className="event-meta-row">
              <span>Spots left</span>
              <strong>{event.spotsLeft}</strong>
            </div>
            <EventRegistrationForm />
          </aside>
        </div>
      </section>
    </main>
  );
}
