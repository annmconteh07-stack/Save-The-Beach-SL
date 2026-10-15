"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { addMediaAction } from "@/lib/actions";

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/avif,image/heic,video/mp4,video/webm,video/ogg,video/quicktime";

type Picked = { file: File; url: string; isVideo: boolean };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="blue-button auth-button" disabled={pending}>
      {pending ? "Posting…" : "Post to gallery"}
    </button>
  );
}

export default function MediaForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Picked[]>([]);
  const [items, setItems] = useState<Picked[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  function syncInput(next: Picked[]) {
    if (inputRef.current) {
      const transfer = new DataTransfer();
      next.forEach((item) => transfer.items.add(item.file));
      inputRef.current.files = transfer.files;
    }
    setItems(next);
  }

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) {
      return;
    }
    const added = Array.from(list).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video/"),
    }));
    syncInput([...items, ...added]);
  }

  function removeFile(index: number) {
    const removed = items[index];
    if (removed) {
      URL.revokeObjectURL(removed.url);
    }
    syncInput(items.filter((_, position) => position !== index));
  }

  return (
    <form className="auth-form media-form" action={addMediaAction}>
      <input
        ref={inputRef}
        className="media-picker-input"
        type="file"
        name="files"
        accept={ACCEPT}
        multiple
        onChange={(event) => addFiles(event.target.files)}
      />

      <div className="media-picker">
        <button type="button" className="media-picker-button" onClick={() => inputRef.current?.click()}>
          <span aria-hidden="true">+</span> Add photos or videos
        </button>
        <p className="media-picker-hint">Pick one or many. Photos up to 15&nbsp;MB, videos up to 75&nbsp;MB.</p>
      </div>

      {items.length > 0 ? (
        <div className="media-preview-grid">
          {items.map((item, index) => (
            <div className="media-preview" key={`${item.url}-${index}`}>
              {item.isVideo ? (
                <video src={item.url} muted playsInline />
              ) : (
                <img src={item.url} alt="" />
              )}
              <button
                type="button"
                className="media-preview-remove"
                onClick={() => removeFile(index)}
                aria-label="Remove this file"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <label>
        Caption <span className="media-optional">(optional)</span>
        <textarea
          className="media-caption"
          name="caption"
          maxLength={400}
          placeholder="Say something about these moments…"
        />
      </label>

      <label>
        Category
        <select name="category" defaultValue="">
          <option value="">Uncategorised</option>
          <option value="CLEANUP">Clean-up</option>
          <option value="COMMUNITY_DAY">Community day</option>
        </select>
      </label>

      <label>
        Or paste a photo/video URL <span className="media-optional">(optional)</span>
        <input type="url" name="url" placeholder="https://example.com/cleanup.jpg" />
      </label>

      <SubmitButton />
    </form>
  );
}
