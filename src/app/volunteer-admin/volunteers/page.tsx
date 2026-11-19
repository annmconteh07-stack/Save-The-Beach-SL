import AutoDismissNotice from "@/components/auto-dismiss-notice";
import VolunteerAdminLayoutShell from "@/components/volunteer-admin-shell";
import VolunteerRecordsTable from "@/components/volunteer-records-table";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminVolunteersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const deletedKind = params.deleted === "volunteer" || params.deleted === "registration" ? params.deleted : null;
  const parsedCount = typeof params.count === "string" ? Number.parseInt(params.count, 10) : NaN;
  const count = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 1;
  const notice = deletedKind
    ? `${count} ${deletedKind === "volunteer" ? "volunteer signup" : "event registration"}${count === 1 ? "" : "s"} deleted.`
    : null;
  const errorMessage =
    params.error === "confirm"
      ? "Please confirm the deletion before continuing."
      : params.error === "delete-failed"
        ? "We could not delete the selected records. Please try again."
        : null;

  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
  });

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return (
    <VolunteerAdminLayoutShell title="Volunteers" description="Everyone who has signed up to help.">
      {notice ? <AutoDismissNotice message={notice} clearQuery={["deleted", "count"]} /> : null}
      {errorMessage ? (
        <div className="notice notice-danger admin-notice" role="alert">
          <p>{errorMessage}</p>
        </div>
      ) : null}

      <div className="admin-columns">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">From the volunteer page</p>
              <h2>General signups</h2>
            </div>
          </div>
          <VolunteerRecordsTable
            kind="volunteer"
            columns={["Name", "Age", "Phone", "Email", "Signed up", "Actions"]}
            emptyMessage="No general volunteer signups yet."
            records={volunteers.map((volunteer) => ({
              id: volunteer.id,
              name: volunteer.name,
              values: [
                String(volunteer.age),
                volunteer.phone,
                volunteer.email,
                new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                  volunteer.createdAt,
                ),
              ],
            }))}
          />
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Per event</p>
              <h2>Event registrations</h2>
            </div>
          </div>
          <VolunteerRecordsTable
            kind="registration"
            columns={["Name", "Age", "Event", "Phone", "Email", "Actions"]}
            emptyMessage="No event registrations yet. They will show up once people sign up to clean-ups."
            records={registrations.map((registration) => ({
              id: registration.id,
              name: registration.name,
              values: [
                String(registration.age),
                registration.event.title,
                registration.phone,
                registration.email,
              ],
            }))}
          />
        </section>
      </div>
    </VolunteerAdminLayoutShell>
  );
}