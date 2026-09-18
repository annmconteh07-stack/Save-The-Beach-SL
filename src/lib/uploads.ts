import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 75 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "image/heic": ".heic",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/ogg": ".ogv",
  "video/quicktime": ".mov",
  "video/m4v": ".m4v",
};

const IMAGE_EXT = /^\.(png|jpe?g|webp|gif|avif|heic)$/;
const VIDEO_EXT = /^\.(mp4|webm|ogv|mov|m4v)$/;

function extensionOf(filename: string) {
  return path.extname(filename).toLowerCase();
}

export function detectMediaKind(file: File): "PHOTO" | "VIDEO" | null {
  const ext = extensionOf(file.name);
  const type = file.type;
  if (type ? type.startsWith("image/") : IMAGE_EXT.test(ext)) {
    return "PHOTO";
  }
  if (type ? type.startsWith("video/") : VIDEO_EXT.test(ext)) {
    return "VIDEO";
  }
  return null;
}

export async function saveUpload(file: File): Promise<{ url: string; kind: "PHOTO" | "VIDEO" }> {
  const kind = detectMediaKind(file);
  if (!kind) {
    throw new Error("Unsupported file type.");
  }

  const maxBytes = kind === "PHOTO" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size === 0) {
    throw new Error("The uploaded file is empty.");
  }
  if (file.size > maxBytes) {
    throw new Error("The uploaded file is too large.");
  }

  const ext = MIME_TO_EXT[file.type] ?? extensionOf(file.name);
  if (!IMAGE_EXT.test(ext) && !VIDEO_EXT.test(ext)) {
    throw new Error("Unsupported file type.");
  }

  const name = `${randomBytes(16).toString("hex")}${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));

  return { url: `/uploads/${name}`, kind };
}

export async function deleteStoredFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) {
    return;
  }
  await unlink(path.join(process.cwd(), "public", url)).catch(() => undefined);
}