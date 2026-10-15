"use client";

import { useState } from "react";

import { adminDeleteAccountAction } from "@/lib/actions";

export default function MemberRowActions({
  userId,
  name,
  email,
  roleLabel,
  postCount,
  commentCount,
}: {
  userId: string;
  name: string;
  email: string;
  roleLabel: string;
  postCount: number;
  commentCount: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const toggle = () => setRevealed((open) => !open);

  return (
    <div
      className={`admin-post-item border-item member-row${revealed ? " is-open" : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={revealed}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      }}
    >
      <div>
        <strong>{name}</strong>
        <small>
          {email} · {roleLabel} · {postCount} posts · {commentCount} comments
        </small>
      </div>
      {revealed ? (
        <div className="admin-action-row" onClick={(event) => event.stopPropagation()}>
          <form action={adminDeleteAccountAction} className="profile-danger-confirm">
            <input type="hidden" name="id" value={userId} />
            {confirmed ? (
              <input type="hidden" name="confirm" value="1" />
            ) : (
              <label>
                <input type="checkbox" name="confirm" value="1" required onChange={() => setConfirmed(true)} />
                Confirm
              </label>
            )}
            <button type="submit" className="delete-button" aria-label={`Delete ${name}`}>
              Delete account
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
