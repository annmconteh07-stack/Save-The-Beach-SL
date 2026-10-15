import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { WaveDivider } from "@/components/waves";

export const dynamic = "force-dynamic";

export default function Home() {
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
              Become a volunteer
            </Link>
            <Link className="hero-text-link" href="/about">
              Discover our work
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

      <SiteFooter />
    </main>
  );
}