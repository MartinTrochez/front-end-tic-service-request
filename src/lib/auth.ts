import { decrypt, getSession } from "./session";

import type { JWTPayload } from "jose";

export type SessionPayload = JWTPayload & {
  userId: string
};

export const auth = {
  api: {
    getSession: async ({ headers }: { headers: Headers }): Promise<SessionPayload | null> => {
      const cookieHeader = headers.get("cookie") ?? "";
      const token = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("session="))
        ?.split("=")[1]

      if (!token) return null

      try {
        return (await decrypt(token)) as SessionPayload;
      } catch {
        return null
      }
    },
  },
  server: {
    getSession,
  },
};
