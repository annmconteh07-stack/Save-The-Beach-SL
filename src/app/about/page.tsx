import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const teamMembers = [
  {
    name: "Mariama Kamara",
    role: "Co-founder & programme lead",
    bio: "A community organiser focused on local partnerships and beach education across Freetown.",
    tone: "tone-blue",
  },
  {
    name: "Ibrahim Sesay",
    role: "Volunteer coordinator",
    bio: "Coordinates cleanup logistics, youth activations, and weekly outreach across the coast.",
    tone: "tone-teal",
  },
  {
    name: "Aminata Conteh",
    role: "Field communications",
    bio: "Documents stories from the shoreline and helps turn local action into a shared movement.",
    tone: "tone-pink",
  },
];

const values = [
  {
    title: "Community first",
    body: "Every clean-up is planned with the people who live and work around the beach.",
    icon: "🤝",
    tone: "tone-blue",
    accent: "var(--blue)",
  },
  {
    title: "Education",
    body: "We do not just pick up waste, we talk about where it comes from and how to stop it.",
    icon: "🎓",
    tone: "tone-teal",
    accent: "var(--teal)",
  },
  {
    title: "Transparency",
    body: "Our events, registrations, and published stories are open for everyone to see.",
    icon: "🔎",
    tone: "tone-grape",
    accent: "var(--grape)",
  },
];

const stats = [
  { value: "3.8k", label: "bags collected", tone: "stat-blue", icon: "🗑️" },
  { value: "12", label: "beaches covered", tone: "stat-teal", icon: "🏖️" },
  { value: "40+", label: "clean-ups run", tone: "stat-sun", icon: "🧹" },
  { value: "900", label: "volunteers strong", tone: "stat-pink", icon: "💪" },
];

export default function AboutPage() {
  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="fun-hero blob-field">
        <span className="blob blob-sun" />
        <span className="blob blob-aqua" />
        <div className="content-width fun-hero-grid">
          <div>
            <span className="pill pill-pink">About us</span>
            <h1>
              We protect the coast by <em>bringing people together.</em>
            </h1>
            <p className="lead">
              Save The Beach SL grew from a simple belief: when communities care for the
              shoreline, the whole coast becomes healthier, safer, and more welcoming.
            </p>
            <div className="hero-tags">
              <span className="pill pill-aqua">Grass-roots</span>
              <span className="pill pill-sun">Volunteer-powered</span>
              <span className="pill pill-teal">Sierra Leone</span>
            </div>
          </div>
          <div className="collage" aria-hidden="true">
            <div className="collage-tile collage-t1">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" alt="" />
            </div>
            <div className="collage-tile collage-t2">
              <img src="https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=800&q=80" alt="" />
            </div>
            <div className="collage-tile collage-t3">
              <img src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80" alt="" />
            </div>
            <span className="collage-chip c1">Tokeh Beach</span>
            <span className="collage-chip c2">Est. 2021</span>
          </div>
        </div>
      </section>

      <section className="band band-ice">
        <div className="content-width alt-row">
          <div className="alt-art">
            <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80" alt="Volunteers on the shoreline" />
            <div className="alt-badge">
              <strong>2021</strong>
              <span>Our first clean-up</span>
            </div>
          </div>
          <div className="alt-copy">
            <span className="pill pill-teal">Our story</span>
            <h2>
              A cleaner beach starts with <em>shared responsibility.</em>
            </h2>
            <p>
              The idea emerged from neighbours, youth volunteers, and local advocates who kept
              noticing the same problem: plastic waste and litter were washing into the spaces
              where families gather, children play, and community life unfolds.
            </p>
            <p>
              We began with small cleanups, then expanded into education, collaborative action,
              and a public platform that makes it easy for anyone to take part. Today, our work
              is rooted in local knowledge and built around community care.
            </p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="content-width">
          <span className="pill pill-grape">What we stand for</span>
          <h2 style={{ fontSize: "clamp(34px,4.2vw,58px)", letterSpacing: "-0.065em", margin: "14px 0 34px" }}>
            Three ideas shape <em style={{ color: "var(--blue)", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>everything we do.</em>
          </h2>
          <div className="bento">
            {values.map((value) => (
              <article key={value.title} className={`fun-card striped ${value.tone} span-4`} style={{ ["--accent" as string]: value.accent }}>
                <div className="fun-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-teal blob-field">
        <span className="blob blob-pink" />
        <div className="content-width">
          <span className="pill pill-sun">Our impact so far</span>
          <h2 style={{ marginBottom: 34 }}>
            Small hands. <em>Big change.</em>
          </h2>
          <div className="bento">
            {stats.map((stat) => (
              <div key={stat.label} className={`stat-tile ${stat.tone} span-1`}>
                <i>{stat.icon}</i>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-ice">
        <div className="content-width">
          <span className="pill pill-blue pill-outline">Meet the team</span>
          <h2 style={{ fontSize: "clamp(34px,4.2vw,58px)", letterSpacing: "-0.065em", margin: "14px 0 34px" }}>
            The people behind <em style={{ color: "var(--blue)", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>the movement.</em>
          </h2>
          <div className="bento">
            {teamMembers.map((member) => (
              <article key={member.name} className={`fun-card ${member.tone} span-1`}>
                <div className="fun-icon" style={{ fontSize: 18, fontWeight: 700 }}>
                  {member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                </div>
                <h3>{member.name}</h3>
                <p style={{ color: "var(--blue)", fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
                  {member.role}
                </p>
                <p>{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-grape">
        <div className="content-width" style={{ textAlign: "center" }}>
          <h2 style={{ margin: "0 auto 18px", maxWidth: 720 }}>
            We would love to have you <em>on the beach.</em>
          </h2>
          <p style={{ margin: "0 auto 30px", maxWidth: 520 }}>
            Join a clean-up, share a story, or simply spread the word. Every action keeps the
            shoreline alive.
          </p>
          <div className="button-row" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary" href="/volunteer">
              Become a volunteer →
            </Link>
            <Link className="btn btn-ghost" href="/events">
              See upcoming clean-ups
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
