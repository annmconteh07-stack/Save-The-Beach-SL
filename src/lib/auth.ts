import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE = "stb_session";
export const SESSION_DAYS = 365;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  avatarUrl: string | null;
};

export type AdminRole = "VOLUNTEER_ADMIN" | "MEDIA_ADMIN" | "ADMIN";

export function isVolunteerAdmin(user: { role: string } | null | undefined) {
  return !!user && (user.role === "VOLUNTEER_ADMIN" || user.role === "ADMIN");
}

export function isMediaAdmin(user: { role: string } | null | undefined) {
  return !!user && (user.role === "MEDIA_ADMIN" || user.role === "ADMIN");
}

export function isAdminRole(role: string | undefined): role is AdminRole {
  return role === "VOLUNTEER_ADMIN" || role === "MEDIA_ADMIN" || role === "ADMIN";
}

function getAuthSecret(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "AUTH_SECRET is not set. Add it in Vercel Project Settings Environment Variables, then redeploy.",
      );
      return null;
    }
    return new TextEncoder().encode("save-the-beach-local-secret");
  }
  return new TextEncoder().encode(secret);
}

export async function createAuthSession(user: SessionUser) {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Set it before deploying.");
  }

  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const secret = getAuthSecret();
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.sub || !payload.email || !payload.name || !payload.role) {
      return null;
    }

    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
      emailVerified: payload.emailVerified === true,
      avatarUrl: typeof payload.avatarUrl === "string" ? payload.avatarUrl : null,
    };
  } catch {
    return null;
  }
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}