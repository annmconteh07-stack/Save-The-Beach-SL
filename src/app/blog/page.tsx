import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const tones = ["tone-blue", "tone-teal", "tone-coral", "tone-sun", "tone-pink", "tone-grape"];

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const status = typeof params.status === "string" ? params.status : null;
  const currentUser = await getCurrentUser();

  const posts = await prisma.post.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      _count: { select: { comments: true } },
    },
  });

  const [featured, ...rest] = posts;

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="fun-hero blob-field">
        <span className="blob blob-sun" />
        <span className="blob blob-aqua" />
        <div className="content-width">
          <span className="pill pill-pink">From the shoreline</span>
          <h1 style={{ maxWidth: 900 }}>
            Stories of care, action, and <em>coastal hope.</em>
          </h1>
          <p className="lead">
            Read what the community is learning, sharing, and building together.
          </p>
          <div className="hero-tags">
            {currentUser ? (
              <>
                <span className="pill pill-teal">Posting as {currentUser.name}</span>
                <Link className="pill pill-blue" href="/blog/new">
                  Write your own story →
                </Link>
              </>
            ) : (
              <>
                <Link className="pill pill-blue" href="/signup">
                  Sign up to post
                </Link>
                <Link className="pill pill-outline" href="/login">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="band band-ice">
        <div className="content-width">
          {status === "submitted" ? (
            <div className="notice notice-success" role="status">
              Story submitted. A member of our team will review it, and it will appear here once approved.
            </div>
          ) : null}

          {posts.length === 0 ? (
            <p className="empty-state">No stories have been published yet. Check back soon.</p>
          ) : (
            <>
              {featured ? (
                <Link className="post-featured" href={`/blog/${featured.id}`}>
                  <div className={`post-featured-art${featured.imageUrl ? "" : " no-img"}`}>
                    {featured.imageUrl ? <img src={featured.imageUrl} alt="" /> : null}
                  </div>
                  <div className="post-featured-body">
                    <span className="pill pill-pink" style={{ alignSelf: "flex-start" }}>Featured story</span>
                    <h2>{featured.title}</h2>
                    <p>
                      {featured.body.slice(0, 180)}
                      {featured.body.length > 180 ? "..." : ""}
                    </p>
                    <div className="blog-meta" style={{ marginBottom: 0 }}>
                      <span>{featured.author.name}</span>
                      <span>
                        {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                          featured.createdAt,
                        )}
                      </span>
                      <span>
                        {featured._count.comments} comment{featured._count.comments === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : null}

              {rest.length > 0 ? (
                <div className="bento">
                  {rest.map((post, index) => (
                    <article key={post.id} className={`blog-card span-2 ${tones[index % tones.length]}`}>
                      <div className={`post-card-art${post.imageUrl ? "" : " no-img"}`}>
                        {post.imageUrl ? <img src={post.imageUrl} alt="" /> : null}
                      </div>
                      <div className="blog-card-body">
                        <span className="pill pill-outline">Field notes</span>
                        <h2 style={{ marginTop: 14 }}>{post.title}</h2>
                        <p>
                          {post.body.slice(0, 120)}
                          {post.body.length > 120 ? "..." : ""}
                        </p>
                        <div className="blog-meta">
                          <span>{post.author.name}</span>
                          <span>
                            {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                              post.createdAt,
                            )}
                          </span>
                        </div>
                        <div className="blog-card-foot">
                          <span className="comment-count">
                            {post._count.comments} comment{post._count.comments === 1 ? "" : "s"}
                          </span>
                          <Link href={`/blog/${post.id}`}>Read article →</Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
