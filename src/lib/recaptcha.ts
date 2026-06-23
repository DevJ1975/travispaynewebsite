// reCAPTCHA verification helper. Canonical flow verifies server-side in Server
// Actions (doc 05 C4). When no secret is configured (local dev), verification is
// skipped so forms remain testable. Enterprise scoring is a hardening follow-up.
export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = (await response.json()) as { success: boolean; score?: number };
    return data.success && (data.score === undefined || data.score >= 0.5);
  } catch {
    return false;
  }
}
