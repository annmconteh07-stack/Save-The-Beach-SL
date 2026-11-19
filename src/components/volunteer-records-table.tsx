"use client";

import { useState } from "react";

import VolunteerDeleteForm from "@/components/volunteer-delete-form";
import { deleteRegistrationsAction, deleteVolunteersAction } from "@/lib/actions";

export default function VolunteerRecordsTable({
  kind,
  columns,
  records,
  emptyMessage,
}: {
  kind: "volunteer" | "registration";
  columns: string[];
  records: { id: string; name: string; values: string[] }[];
  emptyMessage: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const action = kind === "volunteer" ? deleteVolunteersAction : deleteRegistrationsAction;
  const recordType = kind === "volunteer" ? "volunteer signups" : "event registrations";
  const allSelected = records.length > 0 && selected.length === records.length;

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    setConfirming(false);
  }

  function toggleAll() {
    setSelected(allSelected ? [] : records.map((record) => record.id));
    setConfirming(false);
  }

  if (records.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <>
      <form action={action} className="bulk-delete-form">
        <input type="hidden" name="confirm" value="1" />
        {selected.map((id) => (
          <input key={id} type="hidden" name="ids" value={id} />
        ))}
        {confirming ? (
          <>
            <p className="member-delete-warning" role="alert">
              Permanently delete {selected.length} {recordType}? This cannot be undone.
            </p>
            <button type="submit" className="delete-button">
              Yes, delete
            </button>
            <button type="button" className="read-button" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="delete-button"
            disabled={selected.length === 0}
            onClick={() => setConfirming(true)}
          >
            Delete selected{selected.length > 0 ? ` (${selected.length})` : ""}
          </button>
        )}
      </form>

      <div className="registrations-panel">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label={`Select all ${recordType}`}
                />
              </th>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(record.id)}
                    onChange={() => toggle(record.id)}
                    aria-label={`Select ${record.name}`}
                  />
                </td>
                <td>{record.name}</td>
                {record.values.map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
                <td>
                  <VolunteerDeleteForm id={record.id} name={record.name} kind={kind} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
