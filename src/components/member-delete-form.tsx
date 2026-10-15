"use client";

import { useState } from "react";

import { adminDeleteAccountAction } from "@/lib/actions";

export default function MemberDeleteForm({ userId, name }: { userId: string; name: string }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="member-delete-form">
      {confirming ? (
        <form action={adminDeleteAccountAction}>
          <input type="hidden" name="id" value={userId} />
          <input type="hidden" name="confirm" value="1" />
          <p className="member-delete-warning" role="alert">
            Please confirm: this permanently deletes {name}&apos;s account, stories and comments. This cannot be undone.
          </p>
          <div className="member-delete-actions">
            <button type="submit" className="delete-button" aria-label={`Confirm delete ${name}`}>
              Yes, delete account
            </button>
            <button type="button" className="read-button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="delete-button" onClick={() => setConfirming(true)}>
          Delete account
        </button>
      )}
    </div>
  );
}
