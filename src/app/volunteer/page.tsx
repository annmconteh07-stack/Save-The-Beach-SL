import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import VolunteerRegistrationForm from "@/components/volunteer-registration-form";

const steps = [
  { n: "01", title: "Sign up in seconds", body: "Just your name, phone, and email — that is all we need to get you on the list.", tone: "tone-blue", accent: "var(--blue)" },
  { n: "02", title: "Hear about clean-ups", body: "We message you when a beach day is coming up near you, with all the details.", tone: "tone-teal", accent: "var(--teal)" },
  { n: "03", title: "Show up and help", body: "Gloves, bags, and a briefing are provided. Bring energy and a friend if you like.", tone: "tone-sun", accent: "var(--sun)" },
  { n: "04", title: "Celebrate together", body: "We sort and recycle what we collect, then share food and stories afterwards.", tone: "tone-pink", accent: "var(--pink)" },
];

export default async function VolunteerPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const registered = params.registered === "1";

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="fun-hero blob-field">
        <span className="blob blob-sun" />
        <span className="blob blob-aqua" />
        <div className="content-width fun-hero-grid">
          <div>
            <span className="pill pill-teal">Volunteers</span>
            <h1>
              Sign up to help <em>the shore.</em>
            </h1>
            <p className="lead">
              Leave your details and we will add you to our volunteer list. You will hear about
              upcoming clean-ups, events, and everything happening on the beach.
            </p>
            <div className="hero-tags">
              <span className="pill pill-aqua">No experience needed</span>
              <span className="pill pill-sun">All ages welcome</span>
              <span className="pill pill-pink">Free to join</span>
            </div>
          </div>
          <div className="collage" aria-hidden="true">
            <div className="collage-tile collage-t1">
              <img src="https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=800&q=80" alt="" />
            </div>
            <div className="collage-tile collage-t2">
              <img src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80" alt="" />
            </div>
            <div className="collage-tile collage-t3">
              <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80" alt="" />
            </div>
            <span className="collage-chip c1">Over 900 joined</span>
            <span className="collage-chip c2">Free gloves</span>
          </div>
        </div>
      </section>

      <section className="band band-ice">
        <div className="content-width">
          <span className="pill pill-grape">How it works</span>
          <h2 style={{ fontSize: "clamp(34px,4.2vw,58px)", letterSpacing: "-0.065em", margin: "14px 0 34px" }}>
            From sign-up to <em style={{ color: "var(--blue)", fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500 }}>sandy hands.</em>
          </h2>
          <div className="bento">
            {steps.map((step) => (
              <article key={step.n} className={`fun-card striped ${step.tone} span-2`} style={{ ["--accent" as string]: step.accent }}>
                <div className="fun-icon" style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-teal">
        <div className="content-width alt-row">
          <div className="alt-copy">
            <span className="pill pill-sun">Join the list</span>
            <h2>
              All you need is <em style={{ color: "#c9fff1" }}>two hands</em> and a Saturday morning.
            </h2>
            <p>
              Every clean-up gives you gloves, bags, and a briefing. We sort what we collect,
              recycle what we can, and share food together afterwards.
            </p>
            <ul className="detail-list" style={{ color: "#eafff9" }}>
              <li>No experience needed, every age is welcome</li>
              <li>Regular updates on events and clean-ups</li>
            </ul>
          </div>
          <aside className="fun-card" style={{ boxShadow: "var(--shadow-pop)" }}>
            {registered ? (
              <div className="success-panel">
                <h3>You&apos;re on the list. ✅</h3>
                <p>
                  Welcome aboard! We will reach out with the next clean-up dates and everything
                  you need to know.
                </p>
              </div>
            ) : (
              <>
                <span className="pill pill-teal" style={{ marginBottom: 16 }}>Volunteer registration</span>
                <h3 style={{ marginTop: 0 }}>Count me in</h3>
                <p className="form-message">Just your name, phone, and email.</p>
                <VolunteerRegistrationForm />
              </>
            )}
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
