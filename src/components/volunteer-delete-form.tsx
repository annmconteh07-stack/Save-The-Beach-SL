"use client";

import { useState } from "react";

import { deleteRegistrationAction, deleteVolunteerAction } from "@/lib/actions";

export default function VolunteerDeleteForm({
  id,
  name,
  kind,
}: {
  id: string;
  name: string;
  kind: "volunteer" | "registration";
}) {
  const [confirming, setConfirming] = useState(false);
  const action = kind === "volunteer" ? deleteVolunteerAction : deleteRegistrationAction;
  const recordType = kind === "volunteer" ? "volunteer signup" : "event registration";

  return (
    <div className="member-delete-form">
      {confirming ? (
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="confirm" value="1" />
          <p className="member-delete-warning" role="alert">
            Permanently delete {name}&apos;s {recordType}? This cannot be undone.
          </p>
          <div className="member-delete-actions">
            <button type="submit" className="delete-button" aria-label={`Confirm delete ${name}`}>
              Yes, delete
            </button>
            <button type="button" className="read-button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="delete-button"
          onClick={() => setConfirming(true)}
          aria-label={`Delete ${recordType} for ${name}`}
        >
          Delete
        </button>
      )}
    </div>
  );
}
