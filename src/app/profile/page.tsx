import Link from "next/link";
import { redirect } from "next/navigation";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { logoutAction, updateProfileAction } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const avatarTones = ["grad-ocean", "grad-sunset", "grad-lagoon", "grad-grape"];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?next=%2Fprofile");
  }

  const params = (await searchParams) ?? {};
  const updated = params.updated === "1";
  const avatarError = params.error === "avatar-invalid";
  const uploadError = params.error === "avatar-upload-failed";

  const [user, postCount, approvedCount, pendingCount, rejectedCount, commentCount, posts] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: currentUser.id } }),
      prisma.post.count({ where: { authorId: currentUser.id } }),
      prisma.post.count({ where: { authorId: currentUser.id, status: "APPROVED" } }),
      prisma.post.count({ where: { authorId: currentUser.id, status: "PENDING" } }),
      prisma.post.count({ where: { authorId: currentUser.id, status: "REJECTED" } }),
      prisma.comment.count({ where: { authorId: currentUser.id } }),
      prisma.post.findMany({
        where: { authorId: currentUser.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  if (!user) {
    redirect("/login");
  }

  const memberSince = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  const tone = avatarTones[user.id.charCodeAt(0) % avatarTones.length];
  const initials = initialsOf(user.name);
  const profileUrl = `/profile/${user.id}`;

  return (
    <main className="page-shell">
      <SiteHeader />

      <section className="page-hero">
        <div className="content-width page-hero-inner">
          <p className="eyebrow blue-eyebrow">Your profile</p>
          <h1>
            Hello, <em>{user.name.split(" ")[0]}.</em>
          </h1>
          <p>Here&apos;s your activity across the Save The Beach SL community.</p>
          <form className="profile-logout" action={logoutAction}>
            <button type="submit">Log out</button>
          </form>
        </div>
      </section>

      <section className="content-section">
        <div className="content-width">
          {updated ? (
            <div className="notice notice-success" role="status">
              Your profile has been updated.
            </div>
          ) : null}
          {avatarError ? (
            <div className="notice notice-danger" role="alert">
              That file is not a valid avatar image. Please upload a PNG, JPG, WebP, GIF or AVIF photo (up to 5 MB).
            </div>
          ) : null}
          {uploadError ? (
            <div className="notice notice-danger" role="alert">
              Your avatar could not be uploaded. Please try again.
            </div>
          ) : null}

          <div className="profile-layout">
            <aside className="profile-card">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={`${user.name}'s profile picture`} className="profile-avatar-img" />
              ) : (
                <div className={`profile-avatar-lg ${tone}`}>{initials}</div>
              )}
              <h2>{user.name}</h2>
              <p className="profile-role">
                <span className={`pill ${user.role === "ADMIN" ? "pill-pink" : "pill-teal"}`}>
                  {user.role === "ADMIN" ? "Admin" : "Contributor"}
                </span>
              </p>
              <p className="profile-joined">
                Member since <strong>{memberSince}</strong>
              </p>
              <p className="profile-privacy">
                Profile is {user.profileVisibility === "PUBLIC" ? "visible to everyone" : "private (only you)"}
              </p>
              <Link className="line-link small" href={profileUrl} target="_blank">
                View my public profile <span>↗</span>
              </Link>
            </aside>

            <div className="profile-main">
              <div className="profile-stats">
                <div className="stat-tile stat-blue">
                  <strong>{postCount}</strong>
                  <span>stories written</span>
                </div>
                <div className="stat-tile stat-teal">
                  <strong>{approvedCount}</strong>
                  <span>published</span>
                </div>
                <div className="stat-tile stat-sun">
                  <strong>{pendingCount}</strong>
                  <span>waiting review</span>
                </div>
                <div className="stat-tile stat-grape">
                  <strong>{commentCount}</strong>
                  <span>comments left</span>
                </div>
              </div>

              <div className="panel-heading-row">
                <div>
                  <p className="section-kicker blue-kicker">
                    <span>My stories</span>
                  </p>
                  <h3>Your submissions</h3>
                </div>
                <Link className="btn btn-primary" href="/blog/new">
                  Write a new story →
                </Link>
              </div>

              <div className="profile-post-list">
                {posts.length === 0 ? (
                  <p className="empty-state profile-empty">
                    You haven&apos;t written any stories yet. Share your first one from the shoreline.
                  </p>
                ) : (
                  posts.map((post) => (
                    <div className="profile-post-item" key={post.id}>
                      <div>
                        <strong>{post.title}</strong>
                        <small>
                          {new Intl.DateTimeFormat("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(post.createdAt)}
                        </small>
                      </div>
                      <span className={`status-pill status-${post.status.toLowerCase()}`}>{post.status.toLowerCase()}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="profile-edit">
                <div className="panel-heading-row">
                  <div>
                    <p className="section-kicker blue-kicker">
                      <span>Edit profile</span>
                    </p>
                    <h3>Make it yours</h3>
                  </div>
                </div>

                <form className="auth-form profile-form" action={updateProfileAction}>
                  <label>
                    Display name
                    <input type="text" name="name" defaultValue={user.name} minLength={2} maxLength={80} required />
                  </label>
                  <label>
                    Profile picture
                    <input
                      type="file"
                      name="avatar"
                      accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                    />
                    <span className="profile-hint">
                      Upload a photo to replace your initials avatar (up to 5 MB). Leave empty to keep the current one.
                    </span>
                  </label>
                  {user.avatarUrl ? (
                    <label className="profile-remove-avatar">
                      <input type="checkbox" name="removeAvatar" value="1" />
                      Remove my current photo
                    </label>
                  ) : null}
                  <fieldset className="profile-visibility">
                    <legend>Who can see your profile?</legend>
                    <label>
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="PUBLIC"
                        defaultChecked={user.profileVisibility === "PUBLIC"}
                      />
                      Public — anyone can visit your profile and see your stories
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="PRIVATE"
                        defaultChecked={user.profileVisibility === "PRIVATE"}
                      />
                      Private — only you can see your profile page
                    </label>
                  </fieldset>
                  <button type="submit" className="btn btn-primary btn-block">
                    Save changes →
                  </button>
                </form>
              </div>
            </div>
          </div>

          {rejectedCount > 0 ? (
            <p className="empty-state profile-rejected-note">
              {rejectedCount} of your submissions {rejectedCount === 1 ? "was" : "were"} not approved. You can always
              submit a revised version.
            </p>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}