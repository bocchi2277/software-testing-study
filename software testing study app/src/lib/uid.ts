import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const NAME = "qa_uid";

export async function getUid(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(NAME)?.value;
  if (existing && /^[a-zA-Z0-9-]{16,64}$/.test(existing)) return existing;
  const uid = randomUUID();
  jar.set(NAME, uid, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 3,
  });
  return uid;
}
