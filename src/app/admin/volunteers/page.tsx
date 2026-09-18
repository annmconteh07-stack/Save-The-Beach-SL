import AdminLayoutShell from "@/components/admin-shell";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminVolunteersPage() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: "desc" },
  });

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return (
    <AdminLayoutShell title="Volunteers" description="Everyone who has signed up to help.">
      <div className="admin-columns">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">From the volunteer page</p>
              <h2>General signups</h2>
            </div>
          </div>
          {volunteers.length === 0 ? (
            <p className="empty-state">No general volunteer signups yet.</p>
          ) : (
            <div className="registrations-panel">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer.id}>
                      <td>{volunteer.name}</td>
                      <td>{volunteer.age}</td>
                      <td>{volunteer.phone}</td>
                      <td>{volunteer.email}</td>
                      <td>
                        {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                          volunteer.createdAt,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Per event</p>
              <h2>Event registrations</h2>
            </div>
          </div>
          {registrations.length === 0 ? (
            <p className="empty-state">No event registrations yet. They will show up once people sign up to clean-ups.</p>
          ) : (
            <div className="registrations-panel">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Event</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration.id}>
                      <td>{registration.name}</td>
                      <td>{registration.age}</td>
                      <td>{registration.event.title}</td>
                      <td>{registration.phone}</td>
                      <td>{registration.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayoutShell>
  );
}