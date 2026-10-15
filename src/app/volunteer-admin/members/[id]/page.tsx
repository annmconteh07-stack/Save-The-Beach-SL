import Link from "next/link";
import { notFound } from "next/navigation";

import MemberDeleteForm from "@/components/member-delete-form";
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

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  const isSuperAdmin = currentUser?.role === "ADMIN";

  if (!isSuperAdmin) {
    return (
      <VolunteerAdminLayoutShell title="Member" description="Review a member account.">
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
      </VolunteerAdminLayoutShell>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { posts: true, comments: true } } },
  });

  if (!user) {
    notFound();
  }

  const canDelete = user.role === "CONTRIBUTOR";
  const joined = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
    user.createdAt,
  );

  return (
    <VolunteerAdminLayoutShell
      title={user.name}
      description="Review this member account and manage what happens to it."
    >
      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <p className="admin-kicker">Account</p>
            <h2>{user.name}</h2>
          </div>
          <span className="status-pill status-pending">{roleLabel(user.role)}</span>
        </div>
        <dl className="admin-detail-grid">
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{roleLabel(user.role)}</dd>
          </div>
          <div>
            <dt>Email verified</dt>
            <dd>{user.emailVerified ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>{joined}</dd>
          </div>
          <div>
            <dt>Stories</dt>
            <dd>{user._count.posts}</dd>
          </div>
          <div>
            <dt>Comments</dt>
            <dd>{user._count.comments}</dd>
          </div>
        </dl>
      </section>

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <p className="admin-kicker">Danger zone</p>
            <h2>Delete this account</h2>
          </div>
        </div>
        {canDelete ? (
          <>
            <p className="empty-state">
              This permanently removes the account, its stories and comments. This action cannot be undone.
            </p>
            <MemberDeleteForm userId={user.id} name={user.name} />
          </>
        ) : (
          <p className="empty-state">This is a protected account and cannot be deleted.</p>
        )}
      </section>

      <Link className="line-link" href="/volunteer-admin/members">
        Back to members <span>→</span>
      </Link>
    </VolunteerAdminLayoutShell>
  );
}
