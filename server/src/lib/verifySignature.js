import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies an HMAC-SHA512 hex signature (as sent by Paystack's
 * X-Paystack-Signature header) over a raw request body, using a
 * constant-time comparison so response timing can't leak how much of the
 * signature matched.
 */
export function verifyHmacSignature(rawBody, signature, secretKey) {
  if (!rawBody || !signature || !secretKey) return false;

  const expectedSignature = createHmac("sha512", secretKey).update(rawBody).digest("hex");

  const sigBuf = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expectedSignature, "utf8");

  if (sigBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(sigBuf, expectedBuf);
}
