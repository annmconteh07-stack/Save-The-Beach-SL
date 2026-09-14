import Link from "next/link";

import { teamMembers } from "@/app/lib/site-data";

export default function AboutPage() {
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
        <div className="content-width page-hero-inner">
          <p className="eyebrow blue-eyebrow">About us</p>
          <h1>
            We protect the coast by <em>bringing people together.</em>
          </h1>
          <p>
            Save The Beach SL grew from a simple belief: when communities care for the shoreline,
            the whole coast becomes healthier, safer, and more welcoming.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-width story-grid">
          <div>
            <p className="section-kicker blue-kicker">
              <span>01</span> Our story
            </p>
            <h2>
              A cleaner beach starts with <em>shared responsibility.</em>
            </h2>
          </div>
          <div>
            <p>
              The idea emerged from neighbours, youth volunteers, and local advocates who kept
              noticing the same problem: plastic waste and litter were washing into the spaces where
              families gather, children play, and community life unfolds.
            </p>
            <p>
              We began with small cleanups, then expanded into education, collaborative action, and a
              public platform that makes it easy for anyone to take part. Today, our work is rooted in
              local knowledge and built around community care.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section muted-section">
        <div className="content-width">
          <p className="section-kicker blue-kicker">
            <span>02</span> Meet the team
          </p>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <article key={member.name} className="info-card">
                <div className="avatar-badge">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
                <h3>{member.name}</h3>
                <p className="card-label">{member.role}</p>
                <p>{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section contact-section">
        <div className="content-width contact-grid">
          <div>
            <p className="section-kicker blue-kicker">
              <span>03</span> Contact
            </p>
            <h2>We would love to hear from you.</h2>
          </div>
          <div className="info-stack">
            <a href="mailto:hello@savethebeach.sl">hello@savethebeach.sl</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
