import Link from "next/link";
import { notFound } from "next/navigation";

import EventRegistrationForm from "@/components/event-registration-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const registered = sp.registered === "1";
  const alreadyRegistered = sp.registered === "duplicate";
  const eventIsFull = sp.registered === "full";
  const eventHasPassed = sp.registered === "past";

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: true,
    },
  });

  if (!event) {
    notFound();
  }

  const spotsLeft = event.capacityLimit > 0 ? Math.max(event.capacityLimit - event.registrations.length, 0) : null;
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(event.date);

  const highlights = [
    "Plastic collection and sorting",
    "Community breakfast after cleanup",
    "Volunteer briefing and safety walk",
  ];

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="page-hero page-hero-alt">
        <div className="content-width page-hero-inner narrow-copy">
          <p className="eyebrow blue-eyebrow">Community clean-up</p>
          <h1>{event.title}</h1>
          <p>
            {event.location} ·{" "}
            {new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit" }).format(event.date)}
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-width event-detail-grid">
          <div>
            <p className="section-kicker blue-kicker">
              <span>01</span> Event overview
            </p>
            <p>{event.description}</p>
            <ul className="detail-list">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
          <aside className="event-signup-card">
            {registered ? (
              <div className="success-panel">
                <h3>Registration received.</h3>
                <p>You are on the list for this clean-up. We will send the details before the date.</p>
              </div>
            ) : alreadyRegistered ? (
              <div className="notice notice-info" role="status">
                <h3 style={{ marginTop: 0 }}>You&apos;re already signed up.</h3>
                <p>This email address is already registered for this clean-up.</p>
              </div>
            ) : eventIsFull ? (
              <div className="notice notice-warn" role="status">
                <h3 style={{ marginTop: 0 }}>Fully booked.</h3>
                <p>This clean-up has reached its capacity. Join another event or become a general volunteer.</p>
              </div>
            ) : eventHasPassed ? (
              <div className="notice notice-warn" role="status">
                <h3 style={{ marginTop: 0 }}>This clean-up has passed.</h3>
                <p>Registrations are closed. Keep an eye on the events page for the next one.</p>
              </div>
            ) : spotsLeft === 0 ? (
              <div className="notice notice-warn" role="status">
                <h3 style={{ marginTop: 0 }}>Fully booked.</h3>
                <p>Sorry, no spots are left for this clean-up. Join another event instead.</p>
              </div>
            ) : (
              <>
                <p className="card-label">Volunteer registration</p>
                <div className="event-meta-row">
                  <span>Date</span>
                  <strong>{formattedDate}</strong>
                </div>
                <div className="event-meta-row">
                  <span>Spots left</span>
                  <strong>{spotsLeft === null ? "No limit" : spotsLeft}</strong>
                </div>
                <EventRegistrationForm eventId={event.id} />
              </>
            )}
          </aside>
        </div>
        <div className="content-width">
          <Link className="back-link" href="/events">
            ← Back to all clean-ups
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}