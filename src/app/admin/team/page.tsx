import AdminLayoutShell from "@/components/admin-shell";
import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  updateTeamMemberAction,
} from "@/lib/actions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const notice =
    typeof params.added === "string"
      ? "Team member added to the About page."
      : typeof params.updated === "string"
        ? "Team member updated."
        : typeof params.deleted === "string"
          ? "Team member removed."
          : null;

  const members = await prisma.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <AdminLayoutShell title="Team" description="The people shown in the team section on the About page.">
      {notice ? (
        <div className="success-panel admin-notice">
          <p>{notice}</p>
        </div>
      ) : null}

      <div className="admin-columns event-manage-grid">
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Share a role</p>
              <h2>Add a member</h2>
            </div>
          </div>
          <p className="form-message">Members appear in the order you add them, behind their initials.</p>
          <form className="auth-form" action={createTeamMemberAction}>
            <label>
              Name
              <input type="text" name="name" placeholder="e.g. Mariama Kamara" required maxLength={120} />
            </label>
            <label>
              Role
              <input type="text" name="role" placeholder="e.g. Volunteer coordinator" required maxLength={120} />
            </label>
            <label>
              Bio
              <textarea name="bio" rows={3} placeholder="A short line about their work." required maxLength={400} />
            </label>
            <button type="submit" className="blue-button auth-button">
              Add member <span>↗</span>
            </button>
          </form>
        </section>

        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">On the About page</p>
              <h2>Manage team</h2>
            </div>
          </div>
          {members.length === 0 ? (
            <p className="empty-state">No team members yet. Add the first one on the left.</p>
          ) : (
            <div className="admin-media-list">
              {members.map((member) => (
                <div className="admin-event-row" key={member.id}>
                  <div className="admin-media-thumb">
                    <strong style={{ display: "grid", placeItems: "center", height: "100%" }}>
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </strong>
                  </div>
                  <form className="auth-form" action={updateTeamMemberAction} style={{ flex: 1 }}>
                    <input type="hidden" name="id" value={member.id} />
                    <div style={{ display: "grid", gap: 8 }}>
                      <label>
                        Name
                        <input type="text" name="name" defaultValue={member.name} required maxLength={120} />
                      </label>
                      <label>
                        Role
                        <input type="text" name="role" defaultValue={member.role} required maxLength={120} />
                      </label>
                      <label>
                        Bio
                        <textarea name="bio" rows={2} defaultValue={member.bio} required maxLength={400} />
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                      Save
                    </button>
                  </form>
                  <form action={deleteTeamMemberAction}>
                    <input type="hidden" name="id" value={member.id} />
                    <button type="submit" className="delete-button">
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayoutShell>
  );
}