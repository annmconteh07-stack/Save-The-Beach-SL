import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE = "stb_session";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET ?? "save-the-beach-local-secret";
  return new TextEncoder().encode(secret);
}

export async function createAuthSession(user: SessionUser) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecret());

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());

    if (!payload.sub || !payload.email || !payload.name || !payload.role) {
      return null;
    }

    return {
      id: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
