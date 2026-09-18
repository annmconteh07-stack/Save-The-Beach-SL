import Link from "next/link";

import AdminLayoutShell from "@/components/admin-shell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [recentVolunteers, recentPosts] = await Promise.all([
    prisma.volunteer.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { author: true },
    }),
  ]);

  return (
    <AdminLayoutShell
      title="Control room"
      description="Everything across your coastline, in one place."
    >
      <div className="admin-columns">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Keep the dates moving</p>
              <h2>Recent volunteers</h2>
            </div>
            <Link className="panel-link" href="/admin/volunteers">
              View all →
            </Link>
          </div>
          {recentVolunteers.length === 0 ? (
            <p className="empty-state">No volunteers registered yet.</p>
          ) : (
            <div className="admin-event-row volunteer-row">
              {recentVolunteers.map((volunteer) => (
                <div className="volunteer-item" key={volunteer.id}>
                  <span>
                    {volunteer.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <strong>{volunteer.name}</strong>
                    <small>
                      {volunteer.age} yrs · {volunteer.phone} · {volunteer.email}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Give voices a platform</p>
              <h2>Latest posts</h2>
            </div>
            <Link className="panel-link" href="/admin/posts">
              Moderate →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="empty-state">No posts yet.</p>
          ) : (
            <div className="admin-post-list">
              {recentPosts.map((post) => (
                <div className="admin-post-item" key={post.id}>
                  <div>
                    <strong>{post.title}</strong>
                    <small>
                      {post.author.name} · {post.status.toLowerCase()}
                    </small>
                  </div>
                  <div className="admin-action-row">
                    <Link className="read-button" href={`/blog/${post.id}`}>
                      Read
                    </Link>
                    <span className={`status-pill status-${post.status.toLowerCase()}`}>{post.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayoutShell>
  );
}