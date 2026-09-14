import Link from "next/link";

import { blogPosts } from "@/app/lib/site-data";

export default function BlogPage() {
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

      <section className="page-hero page-hero-alt">
        <div className="content-width page-hero-inner">
          <p className="eyebrow blue-eyebrow">From the shoreline</p>
          <h1>
            Stories of care, action, and <em>coastal hope.</em>
          </h1>
          <p>Read what the community is learning, sharing, and building together.</p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-width blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <p className="card-label">{post.category}</p>
              <h2>{post.title}</h2>
              <p>{post.summary}</p>
              <div className="blog-meta">
                <span>{post.author}</span>
                <span>{post.date}</span>
              </div>
              <Link href={`/blog/${post.id}`}>Read article →</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
