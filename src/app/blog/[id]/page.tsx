import Link from "next/link";
import { notFound } from "next/navigation";

import { blogPosts } from "@/app/lib/site-data";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((item) => item.id === id);

  if (!post) {
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
            <Link className="nav-button" href="/blog/new">
              Submit a story
            </Link>
          </div>
        </nav>
      </header>

      <section className="page-hero page-hero-alt">
        <div className="content-width page-hero-inner narrow-copy">
          <p className="eyebrow blue-eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="article-meta">
            {post.author} · {post.date}
          </p>
        </div>
      </section>

      <article className="content-section article-layout">
        <div className="content-width article-body">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Link className="line-link" href="/blog">
            Back to journal <span>→</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
