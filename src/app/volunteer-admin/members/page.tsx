import Link from "next/link";

import VolunteerAdminLayoutShell from "@/components/volunteer-admin-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function roleLabel(role: string) {
  if (role === "VOLUNTEER_ADMIN") return "Volunteer Admin";
  if (role === "MEDIA_ADMIN") return "Media Admin";
  if (role === "ADMIN") return "Super Admin";
  return "Contributor";
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const currentUser = await getCurrentUser();
  const isSuperAdmin = currentUser?.role === "ADMIN";

  const notice = typeof params.deleted === "string" ? "Account deleted." : null;
  const error =
    typeof params.error !== "string"
      ? null
      : params.error === "protected"
        ? "That account is protected and cannot be deleted here."
        : params.error === "confirm"
          ? "Please tick the confirmation box before deleting an account."
          : "Something went wrong. Please try again.";

  const users = isSuperAdmin
    ? await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { posts: true, comments: true } } },
      })
    : [];

  return (
    <VolunteerAdminLayoutShell
      title="Members"
      description="Review contributor accounts and remove anyone abusing the platform."
    >
      {notice ? (
        <div className="success-panel admin-notice">
          <p>{notice}</p>
        </div>
      ) : null}
      {error ? (
        <div className="notice notice-danger admin-notice" role="alert">
          <p>{error}</p>
        </div>
      ) : null}

      {!isSuperAdmin ? (
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">Members</p>
              <h2>Super admin only</h2>
            </div>
          </div>
          <p className="empty-state">
            Only a super admin can review and remove member accounts. Ask a super admin for access.
          </p>
        </section>
      ) : (
        <section className="admin-panel">
          <div className="panel-heading">
            <div>
              <p className="admin-kicker">On the record</p>
              <h2>
                Members <span className="count-pill">{users.length}</span>
              </h2>
            </div>
          </div>
          {users.length === 0 ? (
            <p className="empty-state">No member accounts yet.</p>
          ) : (
            <div className="admin-post-list">
              {users.map((user) => {
                const canDelete = user.role === "CONTRIBUTOR";
                return (
                  <Link className="admin-post-item border-item member-row" key={user.id} href={`/volunteer-admin/members/${user.id}`}>
                    <div>
                      <strong>{user.name}</strong>
                      <small>
                        {user.email} · {roleLabel(user.role)} · {user._count.posts} posts · {user._count.comments}{" "}
                        comments
                      </small>
                    </div>
                    <div className="admin-action-row">
                      {canDelete ? (
                        <span className="member-row-hint">Manage account</span>
                      ) : (
                        <span className="muted">Protected account</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </VolunteerAdminLayoutShell>
  );
}
