"use client";

import { useState } from "react";

import { adminDeleteAccountAction } from "@/lib/actions";

export default function MemberDeleteForm({ userId, name }: { userId: string; name: string }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form action={adminDeleteAccountAction} className="member-delete-form">
      <input type="hidden" name="id" value={userId} />
      {confirmed ? (
        <input type="hidden" name="confirm" value="1" />
      ) : (
        <label className="profile-danger-confirm">
          <input type="checkbox" name="confirm" value="1" required onChange={() => setConfirmed(true)} />
          Confirm
        </label>
      )}
      <button type="submit" className="delete-button" aria-label={`Delete ${name}`}>
        Delete account
      </button>
    </form>
  );
}
