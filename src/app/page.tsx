import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { WaveDivider } from "@/components/waves";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [events, mediaItems] = await Promise.all([
    prisma.event.count({ where: { date: { gte: new Date() } } }),
    prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <main className="blue-site">
      <SiteHeader />

      <section className="blue-hero" id="top">
        <div className="hero-content">
          <p className="eyebrow blue-eyebrow">Freetown · Sierra Leone</p>
          <h1>
            The tide is calling.
            <br />
            <em>Let&apos;s answer.</em>
          </h1>
          <p className="hero-intro">
            A people-powered movement keeping Sierra Leone&apos;s coastline clean, one community clean-up at a time.
          </p>
          <div className="hero-tags" style={{ marginTop: 28 }}>
            <span className="pill pill-sun">Volunteer-powered</span>
            <span className="pill pill-aqua">Community first</span>
            <span className="pill pill-pink">Since 2025</span>
          </div>
          <div className="hero-actions">
            <Link className="white-button" href="/volunteer">
              Become a volunteer <span>→</span>
            </Link>
            <Link className="hero-text-link" href="#mission">
              Discover our work <span>↓</span>
            </Link>
          </div>
        </div>
        <div className="hero-facts">
          <span>01</span>
          <p>
            Hands in the sand.
            <br />
            Hope in the future.
          </p>
        </div>
        <div className="hero-photo-credit">
          Tokeh Beach · Western Area
          <br />
          <span>September 2026</span>
        </div>
      </section>

      <WaveDivider fill="#7f86ff" top="#b0b4ff" />

      <section className="band band-grape marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>Cleaner beaches</span>
          <span>Stronger communities</span>
          <span>Salt in the air</span>
          <span>Hope in the future</span>
          <span>Cleaner beaches</span>
          <span>Stronger communities</span>
          <span>Salt in the air</span>
          <span>Hope in the future</span>
        </div>
      </section>

      <WaveDivider fill="#eef9fd" top="#2ec8c0" />

      <section className="intro-section" id="mission">
        <div className="content-width">
          <div className="section-kicker blue-kicker">
            <span>01</span> Who we are
          </div>
          <div className="intro-grid">
            <h2>
              Our coast is
              <br />
              <em>our common ground.</em>
            </h2>
            <div className="intro-copy">
              <p>
                Save The Beach SL is a grass-roots, volunteer-driven organisation working along the beaches of Sierra
                Leone. We clean the shoreline, educate communities about waste, and build a movement where every person
                has a role to play.
              </p>
              <p>
                Beaches are where our stories meet the sea. They feed us, bring us together, and remind us that what we
                do here matters far beyond the shoreline.
              </p>
              <Link className="line-link" href="/about">
                More about our story <span>↗</span>
              </Link>
            </div>
          </div>
          <div className="bento">
            <div className="stat-tile stat-blue span-1">
              <i>🧹</i>
              <strong>{Math.max(events, 1)}</strong>
              <span>clean-ups planned</span>
            </div>
            <div className="stat-tile stat-sun span-1">
              <i>🗑️</i>
              <strong>3.8k</strong>
              <span>bags collected</span>
            </div>
            <div className="stat-tile stat-pink span-1">
              <i>🏖️</i>
              <strong>12</strong>
              <span>beaches covered</span>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fill="#0a7bb3" top="#2ec8c0" />

      <section className="gallery-strip" id="gallery">
        <div className="content-width">
          <div className="section-heading">
            <div>
              <div className="section-kicker white-kicker">
                <span>02</span> Media
              </div>
              <h2>
                The shoreline
                <br />
                <em>in pictures.</em>
              </h2>
            </div>
            <Link className="outline-button" href="/media">
              Open the gallery <span>→</span>
            </Link>
          </div>
          <div className="gallery-strip-grid">
            {mediaItems.map((item) => (
              <div className="gallery-tile" key={item.id}>
                {item.type === "VIDEO" ? (
                  <video src={item.url} muted controls playsInline className="gallery-tile-media" />
                ) : (
                  <img src={item.url} alt={item.caption} className="gallery-tile-media" />
                )}
                <span>{item.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fill="#ff7f66" top="#ffd166" />

      <section className="signup-section" id="register">
        <div className="signup-inner">
          <p className="eyebrow blue-eyebrow">Your next Saturday could look like this</p>
          <h2>
            Show up for
            <br />
            <em>the shore.</em>
          </h2>
          <Link className="blue-button" href="/volunteer">
            Join the volunteers <span>↗</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}