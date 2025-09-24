"use server"

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
console.log("🔑 SESSION_SECRET en runtime:", secretKey);
if (!secretKey) {
  throw new Error("SESSION_SECRET is required");
}

const EXPIRATION = "7d"
// NOTE: 1 dia
const REFRESH_THRESHOLD = 24 * 60 * 60

const key = new TextEncoder().encode(secretKey);

export async function encrypt(data: any): Promise<string> {
  return await new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION)
    .sign(key);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    throw new Error("Invalid session");
  }
}

export async function createSession(userId: string) {
  const session = await encrypt({ userId });
  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: REFRESH_THRESHOLD * 7,
    path: "/",
    value: session,
  });
}

export async function getSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("session")?.value;
  if (!cookie) return null;
  return await decrypt(cookie);
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session");
}
