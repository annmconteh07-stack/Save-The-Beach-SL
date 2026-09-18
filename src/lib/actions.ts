"use server";

import { randomInt } from "node:crypto";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { clearAuthSession, createAuthSession, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mailer";
import { deleteStoredFile, detectMediaKind, saveUpload } from "@/lib/uploads";

const VERIFY_TOKEN_HOURS = 48;

function safeRedirect(url: string, fallback: string) {
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  return fallback;
}

function newVerifyToken() {
  return randomInt(1_000_000).toString().padStart(6, "0");
}

function verifyTokenExpiry() {
  return new Date(Date.now() + VERIFY_TOKEN_HOURS * 60 * 60 * 1000);
}

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long."),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

const registrationSchema = z.object({
  eventId: z.string().min(1, "Select an event."),
  name: z.string().trim().min(2, "Name must be at least 2 characters long."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  age: z.coerce.number().int().min(13, "Volunteers must be at least 13 years old.").max(120, "Please enter a valid age."),
  emergencyContact: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

const volunteerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address."),
  age: z.coerce.number().int().min(13, "Volunteers must be at least 13 years old.").max(120, "Please enter a valid age."),
});

const storySchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long."),
  body: z.string().trim().min(20, "Please write at least 20 characters for your story."),
  imageUrl: z.string().trim().optional().or(z.literal("")),
});

const commentSchema = z.object({
  postId: z.string().min(1),
  body: z.string().trim().min(1, "Write something before submitting.").max(1000, "Comments are limited to 1000 characters."),
});

const eventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long."),
  description: z.string().trim().min(10, "Please describe the event."),
  date: z.string().min(1, "Pick a date and time."),
  location: z.string().trim().min(2, "Where is the event?"),
  capacityLimit: z.coerce.number().int().min(0),
});

const mediaSchema = z.object({
  caption: z.string().trim().min(1, "Add a short caption."),
  url: z.string().trim().url("Please enter a valid image or video URL."),
  type: z.enum(["PHOTO", "VIDEO"]),
});

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long.").max(80),
  profileVisibility: z.enum(["PUBLIC", "PRIVATE"]),
});

async function requireAdmin() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/login?next=%2Fadmin");
  }
  return currentUser;
}

export async function signUpAction(formData: FormData) {
  const payload = signupSchema.parse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  const normalizedEmail = payload.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    redirect("/signup?error=already-registered");
  }

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(payload.password, 12),
      role: "CONTRIBUTOR",
      verifyToken: newVerifyToken(),
      verifyTokenExpires: verifyTokenExpiry(),
    },
  });

  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    code: user.verifyToken!,
  }).catch((error) => {
    console.error("Failed to send verification email", error);
  });

  await createAuthSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: false,
    avatarUrl: null,
  });

  const nextPath = safeRedirect(String(formData.get("next") ?? ""), "/verify?status=sent");
  redirect(nextPath);
}

export async function loginAction(formData: FormData) {
  const payload = loginSchema.parse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  const user = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(payload.password, user.passwordHash))) {
    redirect("/login?error=invalid-credentials");
  }

  await createAuthSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl,
  });

  const nextPath = safeRedirect(String(formData.get("next") ?? ""), "/blog");
  redirect(nextPath);
}

export async function verifyEmailAction(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  const nextPath = safeRedirect(String(formData.get("next") ?? ""), "/verify?status=verified");

  if (!/^\d{6}$/.test(code)) {
    redirect("/verify?status=invalid");
  }

  const user = await prisma.user.findFirst({ where: { verifyToken: code } });

  if (!user) {
    redirect("/verify?status=invalid");
  }

  if (user.verifyTokenExpires && user.verifyTokenExpires.getTime() < Date.now()) {
    redirect("/verify?status=expired");
  }

  const verified = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verifyToken: null,
      verifyTokenExpires: null,
    },
  });

  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.id === verified.id) {
    await createAuthSession({
      id: verified.id,
      email: verified.email,
      name: verified.name,
      role: verified.role,
      emailVerified: true,
      avatarUrl: verified.avatarUrl,
    });
  }

  redirect(nextPath);
}

export async function resendVerificationAction() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?next=%2Fverify");
  }

  const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
  if (!user || user.emailVerified) {
    redirect("/verify?status=already");
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      verifyToken: newVerifyToken(),
      verifyTokenExpires: verifyTokenExpiry(),
    },
  });

  await sendVerificationEmail({
    to: updated.email,
    name: updated.name,
    code: updated.verifyToken!,
  }).catch((error) => {
    console.error("Failed to resend verification email", error);
  });

  redirect("/verify?status=sent");
}

export async function logoutAction() {
  await clearAuthSession();
  redirect("/");
}

export async function submitEventRegistration(formData: FormData) {
  const payload = registrationSchema.parse({
    eventId: String(formData.get("eventId") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    age: formData.get("age") ?? "",
    emergencyContact: String(formData.get("emergencyContact") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  });

  const event = await prisma.event.findUnique({
    where: { id: payload.eventId },
  });

  if (!event) {
    redirect("/events");
  }

  if (event.date.getTime() <= Date.now()) {
    redirect(`/events/${event.id}?registered=past`);
  }

  const email = payload.email.toLowerCase();

  const outcome = await prisma.$transaction(async (tx) => {
    const alreadyRegistered = await tx.registration.findFirst({
      where: { eventId: event.id, email },
    });
    if (alreadyRegistered) {
      return "duplicate";
    }

    const count = await tx.registration.count({ where: { eventId: event.id } });
    if (event.capacityLimit > 0 && count >= event.capacityLimit) {
      return "full";
    }

    await tx.registration.create({
      data: {
        name: payload.name,
        email,
        phone: payload.phone,
        age: payload.age,
        emergencyContact: payload.emergencyContact || null,
        notes: payload.notes || null,
        eventId: event.id,
      },
    });

    return "ok";
  });

  redirect(`/events/${event.id}?registered=${outcome === "ok" ? "1" : outcome}`);
}

export async function submitVolunteerForm(formData: FormData) {
  const payload = volunteerSchema.parse({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    age: formData.get("age") ?? "",
  });

  await prisma.volunteer.create({
    data: {
      name: payload.name,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      age: payload.age,
    },
  });

  redirect("/volunteer?registered=1");
}

export async function submitStoryAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?next=%2Fblog%2Fnew");
  }

  if (!currentUser.emailVerified) {
    redirect("/verify?status=required&next=%2Fblog%2Fnew");
  }

  const payload = storySchema.parse({
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
  });

  const imageEntry = formData.get("image");
  const imageFile = imageEntry instanceof File ? imageEntry : null;

  let imageUrl = payload.imageUrl;
  if (imageFile) {
    if (detectMediaKind(imageFile) !== "PHOTO") {
      redirect("/blog/new?error=invalid-image");
    }
    try {
      imageUrl = (await saveUpload(imageFile)).url;
    } catch {
      redirect("/blog/new?error=upload-failed");
    }
  }

  await prisma.post.create({
    data: {
      title: payload.title,
      body: payload.body,
      imageUrl: imageUrl || null,
      authorId: currentUser.id,
      status: "PENDING",
    },
  });

  revalidatePath("/blog");
  redirect("/blog?status=submitted");
}

export async function submitCommentAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?next=%2Fblog");
  }

  if (!currentUser.emailVerified) {
    redirect(`/verify?status=required&next=%2Fblog%2F${formData.get("postId") ?? ""}`);
  }

  const payload = commentSchema.parse({
    postId: String(formData.get("postId") ?? ""),
    body: String(formData.get("body") ?? ""),
  });

  const post = await prisma.post.findUnique({
    where: { id: payload.postId, status: "APPROVED" },
  });

  if (!post) {
    redirect("/blog");
  }

  await prisma.comment.create({
    data: {
      body: payload.body,
      authorId: currentUser.id,
      postId: payload.postId,
    },
  });

  revalidatePath(`/blog/${payload.postId}`);
  redirect(`/blog/${payload.postId}#comments`);
}

export async function createEventAction(formData: FormData) {
  await requireAdmin();

  const payload = eventSchema.parse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    date: String(formData.get("date") ?? ""),
    location: String(formData.get("location") ?? ""),
    capacityLimit: formData.get("capacityLimit") ?? "0",
  });

  await prisma.event.create({
    data: {
      title: payload.title,
      description: payload.description,
      date: new Date(payload.date),
      location: payload.location,
      capacityLimit: payload.capacityLimit,
    },
  });

  revalidatePath("/events");
  redirect("/admin/events?created=1");
}

export async function deleteEventAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  await prisma.event.delete({ where: { id } });

  revalidatePath("/events");
  revalidatePath("/admin");
  redirect("/admin/events?deleted=1");
}

export async function addMediaAction(formData: FormData) {
  await requireAdmin();

  const caption = String(formData.get("caption") ?? "").trim();
  const fileEntry = formData.get("file");
  const mediaFile = fileEntry instanceof File ? fileEntry : null;

  if (caption.length < 1) {
    redirect("/admin/media?error=caption");
  }

  let mediaUrl = "";
  let mediaType: "PHOTO" | "VIDEO" = "PHOTO";

  if (mediaFile) {
    try {
      const uploaded = await saveUpload(mediaFile);
      mediaUrl = uploaded.url;
      mediaType = uploaded.kind;
    } catch {
      redirect("/admin/media?error=invalid-file");
    }
  } else {
    const payload = mediaSchema.parse({
      caption,
      url: String(formData.get("url") ?? ""),
      type: String(formData.get("type") ?? "PHOTO") as "PHOTO" | "VIDEO",
    });
    mediaUrl = payload.url;
    mediaType = payload.type;
  }

  await prisma.media.create({
    data: {
      caption,
      url: mediaUrl,
      type: mediaType,
    },
  });

  revalidatePath("/media");
  redirect("/admin/media?added=1");
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const media = await prisma.media.findUnique({ where: { id } });
  if (media) {
    await deleteStoredFile(media.url);
  }
  await prisma.media.delete({ where: { id } });

  revalidatePath("/media");
  revalidatePath("/admin");
  redirect("/admin/media?deleted=1");
}

export async function approvePostAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  await prisma.post.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin/posts?approved=1");
}

export async function rejectPostAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  await prisma.post.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin");
  redirect("/admin/posts?rejected=1");
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const post = await prisma.post.findUnique({ where: { id } });
  if (post) {
    await deleteStoredFile(post.imageUrl);
  }
  await prisma.post.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin/posts?deleted=1");
}

export async function updateProfileAction(formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?next=%2Fprofile");
  }

  const payload = profileSchema.parse({
    name: String(formData.get("name") ?? ""),
    profileVisibility: String(formData.get("profileVisibility") ?? "PUBLIC") as "PUBLIC" | "PRIVATE",
  });

  const avatarEntry = formData.get("avatar");
  const avatarFile = avatarEntry instanceof File && avatarEntry.size > 0 ? avatarEntry : null;
  const removeAvatar = String(formData.get("removeAvatar") ?? "") === "1";

  let avatarUrl = currentUser.avatarUrl;
  if (avatarFile) {
    if (detectMediaKind(avatarFile) !== "PHOTO" || avatarFile.size > 5 * 1024 * 1024) {
      redirect("/profile?error=avatar-invalid");
    }
    try {
      avatarUrl = (await saveUpload(avatarFile)).url;
    } catch {
      redirect("/profile?error=avatar-upload-failed");
    }
  } else if (removeAvatar) {
    avatarUrl = null;
  }
  const previousAvatar = avatarUrl === currentUser.avatarUrl ? null : currentUser.avatarUrl;

  const updated = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: payload.name,
      profileVisibility: payload.profileVisibility,
      avatarUrl,
    },
  });

  await deleteStoredFile(previousAvatar);

  await createAuthSession({
    id: updated.id,
    email: updated.email,
    name: updated.name,
    role: updated.role,
    emailVerified: updated.emailVerified,
    avatarUrl: updated.avatarUrl,
  });

  revalidatePath("/profile");
  redirect("/profile?updated=1");
}