"use client";

import { useEffect, useState } from "react";

const LEAVE_DELAY_MS = 2200;
const LEAVE_ANIMATION_MS = 400;

export default function AutoDismissNotice({
  message,
  clearQuery = [],
  variant = "success",
  toast = false,
}: {
  message: string;
  clearQuery?: string[];
  variant?: "success" | "danger";
  toast?: boolean;
}) {
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);
  const queryKeys = clearQuery.join(",");

  useEffect(() => {
    if (queryKeys) {
      const url = new URL(window.location.href);
      let changed = false;
      for (const key of queryKeys.split(",")) {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          changed = true;
        }
      }
      if (changed) {
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
    }

    const leaveTimer = window.setTimeout(() => setLeaving(true), LEAVE_DELAY_MS);
    const hideTimer = window.setTimeout(() => setHidden(true), LEAVE_DELAY_MS + LEAVE_ANIMATION_MS);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, [queryKeys]);

  if (hidden) return null;

  const base = variant === "danger" ? "notice notice-danger" : "success-panel";
  const classes = toast
    ? `${base} admin-toast${leaving ? " is-leaving" : ""}`
    : `${base} admin-notice auto-dismiss-notice${leaving ? " is-leaving" : ""}`;

  return (
    <div className={classes} role="status">
      <p>{message}</p>
    </div>
  );
}
