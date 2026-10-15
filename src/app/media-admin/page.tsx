import MediaAdminLayoutShell from "@/components/media-admin-shell";
import MediaForm from "@/components/media-form";
import { deleteMediaAction } from "@/lib/actions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const notice = typeof params.added === "string"
    ? "Added to the gallery."
    : typeof params.deleted === "string"
      ? "Media item removed."
      : null;
  const error = typeof params.error === "string"
    ? "That file or link could not be posted. Choose a photo or video in a supported format (JPG, PNG, WebP, GIF, AVIF, MP4, WebM, MOV) under the size limits, or paste a direct media link."
    : null;

  const mediaItems = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <MediaAdminLayoutShell title="Media" description="Post photos and videos taken during clean-ups.">
      {notice ? (
        <div className="success-panel admin-notice">
          <p>{notice}</p>
        </div>
      ) : null}
      {error ? (
        <div className="notice notice-danger admin-notice">
          <p>{error}</p>
        </div>
      ) : null}

      <div className="admin-columns event-manage-grid">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Share a moment</p>
              <h2>Add media</h2>
            </div>
          </div>
          <p className="form-message">
            Add one or many photos or videos, with an optional caption. They go straight to the media page.
          </p>
          <MediaForm />
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">In the gallery</p>
              <h2>Manage media</h2>
            </div>
          </div>
          {mediaItems.length === 0 ? (
            <p className="empty-state">No media yet. Add your first photo or video on the left.</p>
          ) : (
            <div className="admin-media-list">
              {mediaItems.map((item) => (
                <div className="admin-event-row" key={item.id}>
                  <div className="admin-media-thumb">
                    {item.type === "VIDEO" ? (
                      <span className="media-badge">Video</span>
                    ) : (
                      <img src={item.url} alt={item.caption || "Gallery media"} />
                    )}
                  </div>
                  <div>
                    <strong>{item.caption || "No caption"}</strong>
                    <small>
                      {item.type.toLowerCase()}
                      {item.category ? ` · ${item.category === "COMMUNITY_DAY" ? "Community day" : "Clean-up"}` : ""} ·{" "}
                      {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                        item.createdAt,
                      )}
                    </small>
                  </div>
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="delete-button" aria-label="Delete media item">
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MediaAdminLayoutShell>
  );
}