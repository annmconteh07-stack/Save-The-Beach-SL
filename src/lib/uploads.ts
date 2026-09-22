import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

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

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? "uploads";

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
    : null;

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

function allowedExtension(ext: string) {
  return IMAGE_EXT.test(ext) || VIDEO_EXT.test(ext);
}

async function saveToSupabase(file: File, name: string): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase storage is not configured.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(storageBucket).upload(name, bytes, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    throw new Error(error.message);
  }
  const { data } = supabase.storage.from(storageBucket).getPublicUrl(name);
  return data.publicUrl;
}

async function saveToDisk(file: File, name: string): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
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
  if (!allowedExtension(ext)) {
    throw new Error("Unsupported file type.");
  }

  const name = `${randomBytes(16).toString("hex")}${ext}`;
  const url = supabase ? await saveToSupabase(file, name) : await saveToDisk(file, name);

  return { url, kind };
}

export async function deleteStoredFile(url: string | null | undefined) {
  if (!url) {
    return;
  }

  if (url.startsWith("/uploads/")) {
    await unlink(path.join(process.cwd(), "public", url)).catch(() => undefined);
    return;
  }

  if (supabase) {
    const name = url.split("/").pop();
    if (name) {
      await supabase.storage.from(storageBucket).remove([name]).catch(() => undefined);
    }
  }
}