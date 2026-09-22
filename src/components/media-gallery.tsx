"use client";

import { useState } from "react";

type MediaItem = {
  id: string;
  caption: string;
  url: string;
  type: "PHOTO" | "VIDEO";
  category: "CLEANUP" | "COMMUNITY_DAY" | null;
  createdAt: Date;
};

const accents = ["var(--blue)", "var(--teal)", "var(--coral)", "var(--sun)", "var(--grape)", "var(--pink)"];
const pills = ["pill-blue", "pill-teal", "pill-pink", "pill-sun", "pill-grape", "pill-aqua"];

const filters = [
  { key: "ALL", label: "All moments", className: "pill-outline" },
  { key: "PHOTO", label: "Photos", className: "pill-teal" },
  { key: "VIDEO", label: "Videos", className: "pill-grape" },
  { key: "CLEANUP", label: "Clean-ups", className: "pill-sun" },
  { key: "COMMUNITY_DAY", label: "Community days", className: "pill-pink" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

export default function MediaGallery({ mediaItems }: { mediaItems: MediaItem[] }) {
  const [active, setActive] = useState<FilterKey>("ALL");

  const visibleItems = mediaItems.filter((item) => {
    if (active === "ALL") return true;
    if (active === "PHOTO" || active === "VIDEO") return item.type === active;
    return item.category === active;
  });

  return (
    <>
      <div className="chip-row">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={`pill pill-filter ${filter.className} ${active === filter.key ? "pill-active" : ""}`}
            aria-pressed={active === filter.key}
            onClick={() => setActive(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 && mediaItems.length === 0 ? (
        <p className="empty-state">No media posted yet. Check back after the next clean-up.</p>
      ) : visibleItems.length === 0 ? (
        <></>
      ) : (
        <div className="media-masonry">
          {visibleItems.map((item, index) => (
            <figure
              className="media-card"
              key={item.id}
              style={{ borderTop: `6px solid ${accents[index % accents.length]}` }}
            >
              {item.type === "VIDEO" ? (
                <video src={item.url} controls playsInline className="media-visual" preload="metadata" />
              ) : (
                <img src={item.url} alt={item.caption} className="media-visual" loading="lazy" />
              )}
              <figcaption>
                <span className={`pill ${pills[index % pills.length]}`} style={{ marginBottom: 12 }}>
                  {item.type === "VIDEO" ? "Video" : "Photo"}
                </span>
                <p>{item.caption}</p>
                <small>
                  {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                    item.createdAt,
                  )}
                </small>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}