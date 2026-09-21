"use client";

import { useState } from "react";

import { updateProfileAction } from "@/lib/actions";

export default function ProfileEditor({
  name,
  avatarUrl,
  profileVisibility,
  avatarTone,
  initials,
}: {
  name: string;
  avatarUrl: string | null;
  profileVisibility: "PUBLIC" | "PRIVATE";
  avatarTone: string;
  initials: string;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <button
        type="button"
        className="profile-avatar-btn"
        onClick={() => setEditing((value) => !value)}
        aria-expanded={editing}
        aria-label="Edit your profile"
        title="Edit profile"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="profile-avatar-img" />
        ) : (
          <div className={`profile-avatar-lg ${avatarTone}`}>{initials}</div>
        )}
        <span className="profile-avatar-edit" aria-hidden="true">
          ✎
        </span>
      </button>

      {editing ? (
        <div className="profile-edit-inline">
          <span className="pill pill-blue">Edit profile</span>
          <h3 style={{ marginTop: 12 }}>Make it yours.</h3>
          <form className="auth-form profile-form" action={updateProfileAction}>
            <label>
              Display name
              <input type="text" name="name" defaultValue={name} minLength={2} maxLength={80} required />
            </label>
            <label>
              Profile picture
              <input type="file" name="avatar" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" />
              <span className="profile-hint">Upload a new photo (up to 5 MB).</span>
            </label>
            {avatarUrl ? (
              <label className="profile-remove-avatar">
                <input type="checkbox" name="removeAvatar" value="1" />
                Remove my current photo
              </label>
            ) : null}
            <fieldset className="profile-visibility">
              <legend>Who can see your profile?</legend>
              <label>
                <input type="radio" name="profileVisibility" value="PUBLIC" defaultChecked={profileVisibility === "PUBLIC"} />
                Public — anyone can visit your profile and see your stories
              </label>
              <label>
                <input type="radio" name="profileVisibility" value="PRIVATE" defaultChecked={profileVisibility === "PRIVATE"} />
                Private — only you can see your profile page
              </label>
            </fieldset>
            <div className="button-row">
              <button type="submit" className="btn btn-primary">
                Save changes →
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}