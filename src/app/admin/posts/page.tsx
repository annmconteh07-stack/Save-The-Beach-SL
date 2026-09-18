import Link from "next/link";

import AdminLayoutShell from "@/components/admin-shell";
import { approvePostAction, deletePostAction, rejectPostAction } from "@/lib/actions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const notice = typeof params.approved === "string"
    ? "Post approved and published to the blog."
    : typeof params.rejected === "string"
      ? "Post rejected."
      : typeof params.deleted === "string"
        ? "Post deleted."
        : null;

  const pendingPosts = await prisma.post.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: { author: true, _count: { select: { comments: true } } },
  });

  const publishedPosts = await prisma.post.findMany({
    where: { status: { in: ["APPROVED", "REJECTED"] } },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <AdminLayoutShell title="Blog" description="Moderate stories and manage everything published on the journal.">
      {notice ? (
        <div className="success-panel admin-notice">
          <p>{notice}</p>
        </div>
      ) : null}

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <p className="admin-kicker">Awaiting your review</p>
            <h2>Pending posts <span className="count-pill">{pendingPosts.length}</span></h2>
          </div>
        </div>
        {pendingPosts.length === 0 ? (
          <p className="empty-state">No posts waiting for review. All caught up!</p>
        ) : (
          <div className="admin-post-list">
            {pendingPosts.map((post) => (
              <div className="admin-post-item border-item" key={post.id}>
                <div>
                  <strong>{post.title}</strong>
                  <small>
                    {post.author.name} · {post.body.slice(0, 80)}...
                  </small>
                </div>
                <div className="admin-action-row">
                  <Link className="read-button" href={`/blog/${post.id}`}>
                    Read
                  </Link>
                  <form action={approvePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="approve-button">
                      Approve
                    </button>
                  </form>
                  <form action={rejectPostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="reject-button">
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <p className="admin-kicker">On the record</p>
            <h2>All posts</h2>
          </div>
        </div>
        {publishedPosts.length === 0 ? (
          <p className="empty-state">No published or rejected posts yet.</p>
        ) : (
          <div className="admin-post-list">
            {publishedPosts.map((post) => (
              <div className="admin-post-item" key={post.id}>
                <div>
                  <strong>{post.title}</strong>
                  <small>
                    {post.author.name} ·{" "}
                    {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                      post.createdAt,
                    )}
                  </small>
                </div>
                <div className="admin-action-row">
                  <Link className="read-button" href={`/blog/${post.id}`}>
                    Read
                  </Link>
                  <span className={`status-pill status-${post.status.toLowerCase()}`}>{post.status}</span>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="delete-button" aria-label="Delete post">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayoutShell>
  );
}