import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * Self-signed session tokens instead of jsonwebtoken + localStorage Bearer
 * token (the old admin auth) — httpOnly cookie means a stolen XSS payload
 * can no longer read the token. No dependency beyond built-in node:crypto,
 * same pattern as the sibling ab-crm project.
 *
 * Signing secret is generated once and lives in `.session-secret` at the
 * project root (gitignored, mode 0600) — no .env setup required for it.
 */

const SECRET_PATH = path.join(process.cwd(), ".session-secret");
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const SESSION_COOKIE_NAME = "abclinic_admin_session";

function getSecret(): Buffer {
  if (!fs.existsSync(SECRET_PATH)) {
    fs.writeFileSync(SECRET_PATH, randomBytes(32).toString("hex"), {
      mode: 0o600,
    });
  }
  return Buffer.from(fs.readFileSync(SECRET_PATH, "utf8").trim(), "hex");
}

export function createSessionToken(): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const payload = Buffer.from(JSON.stringify({ admin: true, exp: expiresAt.getTime() })).toString(
    "base64url",
  );
  const sig = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return { token: `${payload}.${sig}`, expiresAt };
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expectedSig = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false; // signature mismatch — forged token or secret rotated
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      admin: boolean;
      exp: number;
    };
    if (Date.now() > data.exp) return false;
    return data.admin === true;
  } catch {
    return false;
  }
}
