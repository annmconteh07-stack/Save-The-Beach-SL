"use client";

import { useEffect, useState } from "react";

type MediaItem = {
  id: string;
  caption: string;
  url: string;
  type: "PHOTO" | "VIDEO";
  category: "CLEANUP" | "COMMUNITY_DAY" | null;
  albumId: string | null;
  position: number;
  createdAt: Date;
};

type MediaGroup = { id: string; items: MediaItem[] };

const accents = ["var(--blue)", "var(--teal)", "var(--coral)", "var(--sun)", "var(--grape)", "var(--pink)"];

const filters = [
  { key: "ALL", label: "All moments", className: "pill-outline" },
  { key: "PHOTO", label: "Photos", className: "pill-teal" },
  { key: "VIDEO", label: "Videos", className: "pill-grape" },
  { key: "CLEANUP", label: "Clean-ups", className: "pill-sun" },
  { key: "COMMUNITY_DAY", label: "Community days", className: "pill-pink" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

function groupMedia(items: MediaItem[]): MediaGroup[] {
  const groups: MediaGroup[] = [];
  const byAlbum = new Map<string, MediaGroup>();

  for (const item of items) {
    if (item.albumId) {
      let group = byAlbum.get(item.albumId);
      if (!group) {
        group = { id: item.albumId, items: [] };
        byAlbum.set(item.albumId, group);
        groups.push(group);
      }
      group.items.push(item);
    } else {
      groups.push({ id: item.id, items: [item] });
    }
  }

  return groups.map((group) => ({
    ...group,
    items: [...group.items].sort((a, b) => a.position - b.position),
  }));
}

function MediaVisual({ item }: { item: MediaItem }) {
  if (item.type === "VIDEO") {
    return (
      <>
        <video src={item.url} muted playsInline preload="metadata" />
        <span className="media-tile-play" aria-hidden="true">
          ▶
        </span>
      </>
    );
  }
  return <img src={item.url} alt={item.caption || "Gallery media"} loading="lazy" />;
}

function Collage({ items, onOpen }: { items: MediaItem[]; onOpen: (index: number) => void }) {
  const shown = items.slice(0, 3);
  const extra = items.length - shown.length;

  return (
    <div className={`media-collage media-collage-${Math.min(items.length, 3)}`}>
      {shown.map((item, index) => (
        <button
          type="button"
          className="media-tile"
          key={item.id}
          onClick={() => onOpen(index)}
          aria-label={`Open ${item.type === "VIDEO" ? "video" : "photo"} ${index + 1} of ${items.length}`}
        >
          <MediaVisual item={item} />
          {index === shown.length - 1 && extra > 0 ? <span className="media-tile-more">+{extra}</span> : null}
        </button>
      ))}
    </div>
  );
}

export default function MediaGallery({ mediaItems }: { mediaItems: MediaItem[] }) {
  const [active, setActive] = useState<FilterKey>("ALL");
  const [lightbox, setLightbox] = useState<{ items: MediaItem[]; index: number } | null>(null);

  useEffect(() => {
    if (!lightbox) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightbox(null);
      } else if (event.key === "ArrowRight") {
        setLightbox((prev) => (prev ? { ...prev, index: (prev.index + 1) % prev.items.length } : prev));
      } else if (event.key === "ArrowLeft") {
        setLightbox((prev) =>
          prev ? { ...prev, index: (prev.index - 1 + prev.items.length) % prev.items.length } : prev,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const groups = groupMedia(mediaItems);
  const visibleGroups = groups.filter((group) => {
    if (active === "ALL") return true;
    if (active === "PHOTO" || active === "VIDEO") return group.items.some((item) => item.type === active);
    return group.items.some((item) => item.category === active);
  });

  const current = lightbox ? lightbox.items[lightbox.index] : null;

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

      {visibleGroups.length === 0 && mediaItems.length === 0 ? (
        <p className="empty-state">No media posted yet. Check back after the next clean-up.</p>
      ) : visibleGroups.length === 0 ? (
        <></>
      ) : (
        <div className="media-feed">
          {visibleGroups.map((group, index) => {
            const lead = group.items[0];
            return (
              <figure
                className="media-card media-post"
                key={group.id}
                style={{ borderTop: `6px solid ${accents[index % accents.length]}` }}
              >
                <Collage items={group.items} onOpen={(position) => setLightbox({ items: group.items, index: position })} />
                <figcaption>
                  {lead.caption ? <p>{lead.caption}</p> : null}
                  <small>
                    {new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                      lead.createdAt,
                    )}
                  </small>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {lightbox && current ? (
        <div className="media-lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button type="button" className="media-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
            ×
          </button>
          {lightbox.items.length > 1 ? (
            <>
              <button
                type="button"
                className="media-lightbox-nav media-lightbox-prev"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightbox((prev) =>
                    prev ? { ...prev, index: (prev.index - 1 + prev.items.length) % prev.items.length } : prev,
                  );
                }}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                className="media-lightbox-nav media-lightbox-next"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightbox((prev) => (prev ? { ...prev, index: (prev.index + 1) % prev.items.length } : prev));
                }}
                aria-label="Next"
              >
                ›
              </button>
            </>
          ) : null}
          <figure className="media-lightbox-figure" onClick={(event) => event.stopPropagation()}>
            {current.type === "VIDEO" ? (
              <video src={current.url} controls autoPlay playsInline />
            ) : (
              <img src={current.url} alt={current.caption || "Gallery media"} />
            )}
            {current.caption ? <figcaption className="media-lightbox-caption">{current.caption}</figcaption> : null}
            <p className="media-lightbox-counter">
              {lightbox.index + 1} / {lightbox.items.length}
            </p>
          </figure>
        </div>
      ) : null}
    </>
  );
}
