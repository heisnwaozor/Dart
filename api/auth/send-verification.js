import crypto from 'node:crypto';

const VERIFICATION_SECRET = process.env.SESSION_SECRET || 'dart-verification-secret-2026';

function generateVerificationToken(email, code, expiresAt) {
  const data = `${email.toLowerCase().trim()}:${code.trim()}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', VERIFICATION_SECRET).update(data).digest('hex');
  return `${expiresAt}.${hmac}`;
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
    const name = (body?.name || '').trim();

    if (!email || !email.includes('@')) {
      return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const verificationToken = generateVerificationToken(email, code, expiresAt);

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Dart Verification <onboarding@resend.dev>',
            to: [email],
            subject: `${code} is your Dart verification code`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 24px; background: #0f172a; color: #ffffff; border-radius: 12px;">
                <h2 style="color: #05c92f; margin-bottom: 8px;">Dart Hackathon Platform</h2>
                <p style="color: #94a3b8; font-size: 14px;">Hello ${name || 'Builder'},</p>
                <p style="font-size: 14px; color: #e2e8f0;">Your verification code is:</p>
                <div style="margin: 20px 0; padding: 16px; background: #1e293b; border: 2px solid #05c92f; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; color: #ffffff;">
                  ${code}
                </div>
                <p style="color: #64748b; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
              </div>
            `
          })
        });
      } catch (mailErr) {
        console.warn('[Email] Resend dispatch notice:', mailErr);
      }
    }

    console.log(`[Email Verification] Code for ${email} (${name}): ${code}`);

    return res.status(200).json({
      ok: true,
      message: `Verification code sent to ${email}`,
      verificationToken,
      devCode: code
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
