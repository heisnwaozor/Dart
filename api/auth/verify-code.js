import crypto from 'node:crypto';

const VERIFICATION_SECRET = process.env.SESSION_SECRET || 'dart-verification-secret-2026';

function verifyVerificationToken(email, code, token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [expiresAtStr, hmac] = token.split('.');
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;
  const data = `${email.toLowerCase().trim()}:${code.trim()}:${expiresAt}`;
  const expectedHmac = crypto.createHmac('sha256', VERIFICATION_SECRET).update(data).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const email = (body?.email || '').trim().toLowerCase();
    const code = (body?.code || '').trim();
    const verificationToken = body?.verificationToken;

    if (!email || !code) {
      return res.status(400).json({ ok: false, error: 'Email and 6-digit code are required.' });
    }

    const isValid = verifyVerificationToken(email, code, verificationToken);
    if (!isValid) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid or expired verification code. Please check your email or request a new code.'
      });
    }

    return res.status(200).json({
      ok: true,
      verified: true,
      message: 'Email verified successfully!'
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
