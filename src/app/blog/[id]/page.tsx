import Link from "next/link";
import { notFound } from "next/navigation";

import CommentForm from "@/components/comment-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const isAdminView = post.status !== "APPROVED" && currentUser?.role === "ADMIN";

  if (post.status !== "APPROVED" && !isAdminView) {
    notFound();
  }

  const paragraphs = post.body.split(/\n+/).filter(Boolean);

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="page-hero page-hero-alt">
        <div className="content-width page-hero-inner narrow-copy">
          <p className="eyebrow blue-eyebrow">Field notes</p>
          <h1>{post.title}</h1>
          <p className="article-meta">
            {post.author.name} ·{" "}
            {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(post.createdAt)}
          </p>
        </div>
      </section>

      <article className="content-section article-layout">
        <div className="content-width article-body">
          {isAdminView ? (
            <div className="preview-notice">
              <span>Preview</span> This post is {post.status.toLowerCase()} and only visible to admins.
            </div>
          ) : null}
          {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="article-image" /> : null}
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="comments-section" id="comments">
            <p className="section-kicker blue-kicker">
              <span>{post.comments.length}</span>{" "}
              {post.comments.length === 1 ? "Comment" : "Comments"}
            </p>

            {currentUser ? (
              <CommentForm postId={post.id} />
            ) : (
              <p className="form-message">
                <Link href="/login?next=%2Fblog">Log in</Link> or{" "}
                <Link href="/signup?next=%2Fblog">sign up</Link> to join the conversation.
              </p>
            )}

            <div className="comment-list">
              {post.comments.map((comment) => (
                <div className="comment-item" key={comment.id}>
                  <div className="comment-avatar">
                    {comment.author.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="comment-meta">
                      <strong>{comment.author.name}</strong>
                      <span>
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(comment.createdAt)}
                      </span>
                    </div>
                    <p>{comment.body}</p>
                  </div>
                </div>
              ))}
              {post.comments.length === 0 ? (
                <p className="empty-state">No comments yet. Be the first to share your thoughts.</p>
              ) : null}
            </div>
          </div>

          <Link className="line-link" href="/blog">
            Back to journal <span>→</span>
          </Link>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}