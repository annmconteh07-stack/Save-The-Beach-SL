import AdminLayoutShell from "@/components/admin-shell";
import EventForm from "@/components/event-form";
import { deleteEventAction } from "@/lib/actions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const notice = typeof params.created === "string"
    ? "Event created and published to the site."
    : typeof params.deleted === "string"
      ? "Event deleted."
      : null;

  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: { registrations: true },
  });

  return (
    <AdminLayoutShell title="Events" description="Create clean-ups, post dates and times, and delete events.">
      {notice ? (
        <div className="success-panel admin-notice">
          <p>{notice}</p>
        </div>
      ) : null}

      <div className="admin-columns event-manage-grid">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Add a new date</p>
              <h2>Post an event</h2>
            </div>
          </div>
          <p className="form-message">
            The event will appear on the clean-ups page and the homepage immediately.
          </p>
          <EventForm />
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Live on the site</p>
              <h2>Manage events</h2>
            </div>
          </div>
          {events.length === 0 ? (
            <p className="empty-state">No events yet. Create your first one on the left.</p>
          ) : (
            <div className="admin-event-list">
              {events.map((event) => {
                const spotsLeft =
                  event.capacityLimit > 0 ? Math.max(event.capacityLimit - event.registrations.length, 0) : null;
                return (
                  <div className="admin-event-row" key={event.id}>
                    <div className="admin-mini-date">
                      <strong>{new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(event.date)}</strong>
                      <span>{new Intl.DateTimeFormat("en-GB", { month: "short" }).format(event.date).toUpperCase()}</span>
                    </div>
                    <div>
                      <strong>{event.title}</strong>
                      <small>
                        {event.location} · {event.registrations.length} registrations ·{" "}
                        {spotsLeft === null ? "no capacity limit" : `${spotsLeft} spots left`}
                      </small>
                    </div>
                    <form action={deleteEventAction}>
                      <input type="hidden" name="id" value={event.id} />
                      <button type="submit" className="delete-button" aria-label={`Delete ${event.title}`}>
                        Delete
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AdminLayoutShell>
  );
}