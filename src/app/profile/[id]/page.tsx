import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const avatarTones = ["grad-ocean", "grad-sunset", "grad-lagoon", "grad-grape"];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { comments: true } } },
      },
      _count: { select: { comments: true, posts: true } },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwner = currentUser?.id === user.id;
  const isAdmin = currentUser?.role === "ADMIN";

  if (user.profileVisibility === "PRIVATE" && !isOwner && !isAdmin) {
    notFound();
  }

  const memberSince = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  const tone = avatarTones[user.id.charCodeAt(0) % avatarTones.length];
  const initials = initialsOf(user.name);

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="page-hero">
        <div className="content-width page-hero-inner">
          <p className="eyebrow blue-eyebrow">Community member</p>
          <h1>
            <em>{user.name}</em> &amp; the shore.
          </h1>
          <p>
            Stories published by {user.name} across the Save The Beach SL journal.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="content-width">
          {isOwner ? (
            <div className="notice notice-info">
              This is your public profile — <Link href="/profile">edit it here</Link>.
            </div>
          ) : null}

          <div className="profile-layout">
            <aside className="profile-card">
              <div className={`profile-avatar-lg ${tone}`}>{initials}</div>
              <h2>{user.name}</h2>
              <p className="profile-role">
                <span className={`pill ${user.role === "ADMIN" ? "pill-pink" : "pill-teal"}`}>
                  {user.role === "ADMIN" ? "Admin" : "Contributor"}
                </span>
              </p>
              <p className="profile-joined">
                Member since <strong>{memberSince}</strong>
              </p>
              <p className="profile-privacy">
                {user.posts.length} published {user.posts.length === 1 ? "story" : "stories"}
              </p>
            </aside>

            <div className="profile-main">
              <div className="profile-stats">
                <div className="stat-tile stat-blue">
                  <strong>{user.posts.length}</strong>
                  <span>published stories</span>
                </div>
                <div className="stat-tile stat-teal">
                  <strong>{user._count.comments}</strong>
                  <span>comments shared</span>
                </div>
              </div>

              <div className="panel-heading-row">
                <div>
                  <p className="section-kicker blue-kicker">
                    <span>Published</span>
                  </p>
                  <h3>Stories by {user.name.split(" ")[0]}</h3>
                </div>
              </div>

              <div className="profile-post-list">
                {user.posts.length === 0 ? (
                  <p className="empty-state profile-empty">
                    No published stories yet.
                  </p>
                ) : (
                  user.posts.map((post) => (
                    <Link className="profile-post-item profile-post-link" href={`/blog/${post.id}`} key={post.id}>
                      <div>
                        <strong>{post.title}</strong>
                        <small>
                          {new Intl.DateTimeFormat("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(post.createdAt)}
                        </small>
                      </div>
                      <span className="comment-count">
                        {post._count.comments} comment{post._count.comments === 1 ? "" : "s"}
                      </span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}