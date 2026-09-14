const events = [
  { day: "06", month: "OCT", title: "Lumley Beach sunrise clean-up", place: "Lumley Beach, Freetown", time: "7:00 AM", spots: "42 spots left" },
  { day: "20", month: "OCT", title: "Tokeh shores community day", place: "Tokeh Beach, Western Area", time: "8:00 AM", spots: "18 spots left" },
  { day: "03", month: "NOV", title: "Hamilton shoreline sweep", place: "Hamilton Beach, Freetown", time: "7:30 AM", spots: "29 spots left" },
];

const stories = [
  { label: "Field notes", title: "What the tide leaves behind", date: "12 Sep 2026" },
  { label: "Community voice", title: "Small hands, big change", date: "28 Aug 2026" },
];

export default function Home() {
  return (
    <main className="blue-site">
      <div className="announcement">Next clean-up: Lumley Beach · Saturday 06 October <a href="#events">Reserve your spot <span>↗</span></a></div>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand blue-brand" href="/" aria-label="Save The Beach SL home"><span className="brand-mark">STB</span><span>Save The Beach<br /><i>SL</i></span></a>
        <div className="nav-links"><a href="/about">About</a><a href="/events">Clean-ups</a><a href="/blog">Journal</a><a href="/about#contact">About us</a></div>
        <div className="nav-actions"><a className="admin-link" href="/admin">Admin portal <span>↗</span></a><a className="nav-button" href="/events">Join a clean-up</a></div>
      </nav>

      <section className="blue-hero" id="top">
        <div className="hero-content"><p className="eyebrow blue-eyebrow">Freetown · Sierra Leone</p><h1>The tide is calling.<br /><em>Let&apos;s answer.</em></h1><p className="hero-intro">A people-powered movement keeping Sierra Leone&apos;s coastline clean, one community clean-up at a time.</p><div className="hero-actions"><a className="white-button" href="#events">Find a clean-up <span>→</span></a><a className="hero-text-link" href="#mission">Discover our work <span>↓</span></a></div></div>
        <div className="hero-facts"><span>01</span><p>Hands in the sand.<br />Hope in the future.</p></div><div className="hero-photo-credit">Tokeh Beach · Western Area<br /><span>September 2026</span></div>
      </section>

      <section className="intro-section" id="mission"><div className="wave-top white-wave" aria-hidden="true" /><div className="content-width"><div className="section-kicker blue-kicker"><span>01</span> Why we show up</div><div className="intro-grid"><h2>Our coast is<br /><em>our common ground.</em></h2><div className="intro-copy"><p>Beaches are where our stories meet the sea. They feed us, bring us together, and remind us that what we do here matters far beyond the shoreline.</p><p>Save The Beach SL makes it easy to turn care into action through clean-ups, education, and a community that believes a cleaner coast begins with all of us.</p><a className="line-link" href="#about">More about our story <span>↗</span></a></div></div><div className="impact-row"><div><strong>28</strong><span>clean-ups<br />completed</span></div><div><strong>1,240</strong><span>volunteers<br />registered</span></div><div><strong>3.8k</strong><span>bags collected<br />and counting</span></div><div className="impact-note">Our impact<br /><em>so far.</em></div></div></div></section>

      <section className="events-section" id="events"><div className="wave-top blue-wave" aria-hidden="true" /><div className="content-width"><div className="section-heading"><div><div className="section-kicker white-kicker"><span>02</span> Come along</div><h2>Good people.<br /><em>Good tides.</em></h2></div><p>Bring a friend, bring your energy,<br />and we&apos;ll bring the gloves.</p></div><div className="event-list">{events.map((event) => <article className="event-card" key={event.title}><div className="event-date"><strong>{event.day}</strong><span>{event.month}</span></div><div className="event-details"><p className="event-label">Community clean-up</p><h3>{event.title}</h3><p>{event.place} · {event.time}</p></div><div className="event-spots"><span>{event.spots}</span><a href="/events">Register <b>↗</b></a></div></article>)}</div><a className="outline-button" href="/events">View all clean-ups <span>→</span></a></div></section>

      <section className="journal-section" id="stories"><div className="content-width journal-layout"><div className="journal-photo" aria-hidden="true"><div className="photo-label">Stories from<br /><em>the shoreline</em></div></div><div className="journal-content"><div className="section-kicker blue-kicker"><span>03</span> From our community</div><h2>Every shoreline<br />has a <em>story.</em></h2><div className="story-list">{stories.map((story) => <a className="story-item" href="/blog" key={story.title}><div><p>{story.label}</p><h3>{story.title}</h3><span>{story.date}</span></div><b>↗</b></a>)}</div><a className="line-link" href="/blog">Read the journal <span>→</span></a></div></div></section>

      <section className="signup-section" id="register"><div className="wave-top coral-wave" aria-hidden="true" /><div className="signup-inner"><p className="eyebrow blue-eyebrow">Your next Saturday could look like this</p><h2>Show up for<br /><em>the shore.</em></h2><a className="blue-button" href="/events">Choose your clean-up <span>↗</span></a></div></section>

      <footer className="site-footer" id="about"><div className="content-width footer-grid"><div className="brand blue-brand"><span className="brand-mark">STB</span><span>Save The Beach<br /><i>SL</i></span></div><p>For the love of our coast,<br />and everyone who calls it home.</p><div className="footer-links"><a href="mailto:hello@savethebeach.sl">hello@savethebeach.sl</a><a href="#instagram">Instagram</a><a href="#facebook">Facebook</a><a href="/admin">Admin portal ↗</a></div><small>© 2026 Save The Beach SL</small></div></footer>
    </main>
  );
}
