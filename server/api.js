import crypto from 'node:crypto';
import {
  getAllUsers,
  getUserByWallet,
  getUserByEmail,
  saveUser,
  getAllProjects,
  getProjectById,
  saveProject,
  getAllVotes,
  getVoteByVoter,
  castVote,
  getDatabaseStats,
  resetDatabase
} from './db.js';

const VERIFICATION_SECRET = process.env.SESSION_SECRET || 'dart-verification-secret-2026';

function generateVerificationToken(email, code, expiresAt) {
  const data = `${email.toLowerCase().trim()}:${code.trim()}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', VERIFICATION_SECRET).update(data).digest('hex');
  return `${expiresAt}.${hmac}`;
}

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

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export async function handleApiRequest(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return true;
  }

  // 1. Status & Health
  if (pathname === '/api/status' && method === 'GET') {
    const stats = getDatabaseStats();
    sendJson(res, 200, { ok: true, stats });
    return true;
  }

  // 2. Users endpoints
  if (pathname === '/api/users' && method === 'GET') {
    const users = getAllUsers();
    sendJson(res, 200, { ok: true, users });
    return true;
  }

  if (pathname.startsWith('/api/users/') && method === 'GET') {
    const identifier = decodeURIComponent(pathname.replace('/api/users/', ''));
    const user = getUserByWallet(identifier) || getUserByEmail(identifier);
    if (!user) {
      sendJson(res, 404, { ok: false, error: 'User not found in database' });
      return true;
    }
    sendJson(res, 200, { ok: true, user });
    return true;
  }

  // GitHub OAuth Code Exchange
  if (pathname === '/api/auth/github' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const { code, redirect_uri } = body || {};
      const clientId = process.env.VITE_GITHUB_CLIENT_ID || 'Ov23likydacnWhm2cBjL';
      const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.VITE_GITHUB_CLIENT_SECRET;

      if (!code) {
        sendJson(res, 400, { ok: false, error: 'Missing authorization code' });
        return true;
      }

      if (!clientSecret) {
        sendJson(res, 400, { ok: false, error: 'GITHUB_CLIENT_SECRET not configured on server' });
        return true;
      }

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirect_uri
        })
      });

      const tokenData = await tokenRes.json();
      if (tokenData.error || !tokenData.access_token) {
        sendJson(res, 400, {
          ok: false,
          error: tokenData.error_description || tokenData.error || 'Failed to exchange token with GitHub'
        });
        return true;
      }

      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'User-Agent': 'Dart-Hackathon-App'
        }
      });

      if (!userRes.ok) {
        sendJson(res, 400, { ok: false, error: 'Failed to fetch user profile from GitHub' });
        return true;
      }

      const userData = await userRes.json();
      let email = userData.email;

      if (!email) {
        try {
          const emailsRes = await fetch('https://api.github.com/user/emails', {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
              'User-Agent': 'Dart-Hackathon-App'
            }
          });
          const emails = await emailsRes.json();
          if (Array.isArray(emails)) {
            const primary = emails.find(e => e.primary) || emails[0];
            if (primary) email = primary.email;
          }
        } catch (e) {}
      }

      sendJson(res, 200, {
        ok: true,
        user: {
          name: userData.name || userData.login,
          email: email || `${userData.login}@users.noreply.github.com`,
          avatar: userData.avatar_url || `https://github.com/${userData.login}.png`,
          githubLogin: userData.login
        }
      });
      return true;
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message });
      return true;
    }
  }

  // Send email verification code
  if (pathname === '/api/auth/send-verification' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const name = (body.name || '').trim();

      if (!email || !email.includes('@')) {
        sendJson(res, 400, { ok: false, error: 'Please provide a valid email address.' });
        return true;
      }

      // Generate 6-digit OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
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

      sendJson(res, 200, {
        ok: true,
        message: `Verification code sent to ${email}`,
        verificationToken,
        devCode: code
      });
      return true;
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message });
      return true;
    }
  }

  // Verify email verification code
  if (pathname === '/api/auth/verify-code' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const code = (body.code || '').trim();
      const verificationToken = body.verificationToken;

      if (!email || !code) {
        sendJson(res, 400, { ok: false, error: 'Email and 6-digit code are required.' });
        return true;
      }

      const isValid = verifyVerificationToken(email, code, verificationToken);
      if (!isValid) {
        sendJson(res, 400, {
          ok: false,
          error: 'Invalid or expired verification code. Please check your email or request a new code.'
        });
        return true;
      }

      sendJson(res, 200, {
        ok: true,
        verified: true,
        message: 'Email verified successfully!'
      });
      return true;
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message });
      return true;
    }
  }

  // User registration / login recording
  if ((pathname === '/api/users' || pathname === '/api/auth/register') && method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!body.walletAddress && !body.email && !body.name) {
        sendJson(res, 400, { ok: false, error: 'Missing required user fields (name, email or wallet)' });
        return true;
      }

      // Generate a mock Stellar address if none provided
      if (!body.walletAddress) {
        const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let addr = 'G';
        for (let i = 0; i < 55; i++) {
          addr += chars[Math.floor(Math.random() * chars.length)];
        }
        body.walletAddress = addr;
      }

      const saved = saveUser({
        id: body.id,
        name: body.name || 'Anonymous Voter',
        email: body.email,
        avatar: body.avatar,
        walletAddress: body.walletAddress,
        chain: body.chain || 'stellar',
        provider: body.provider || 'google',
        role: body.role || 'voter'
      });

      sendJson(res, 201, { ok: true, message: 'Account recorded in database', user: saved });
      return true;
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message });
      return true;
    }
  }

  // 3. Projects endpoints
  if (pathname === '/api/projects' && method === 'GET') {
    const projects = getAllProjects();
    sendJson(res, 200, { ok: true, projects });
    return true;
  }

  if (pathname.startsWith('/api/projects/') && method === 'GET') {
    const id = pathname.replace('/api/projects/', '');
    const project = getProjectById(id);
    if (!project) {
      sendJson(res, 404, { ok: false, error: 'Project not found' });
      return true;
    }
    sendJson(res, 200, { ok: true, project });
    return true;
  }

  // Submit project (requires account)
  if (pathname === '/api/projects' && method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!body.name || !body.tagline || !body.description || !body.submittedBy) {
        sendJson(res, 400, {
          ok: false,
          error: 'Missing required fields. Project name, tagline, description, and submitter wallet are required.'
        });
        return true;
      }

      // Verify that submitter exists in our users database, or auto-record their account
      let user = getUserByWallet(body.submittedBy);
      if (!user) {
        // Automatically ensure the builder account is recorded in users table
        user = saveUser({
          name: body.teamName || 'Builder Account',
          walletAddress: body.submittedBy,
          avatar: body.teamAvatar,
          provider: 'wallet',
          role: 'builder'
        });
      }

      const saved = saveProject(body);
      sendJson(res, 201, { ok: true, message: 'Project recorded in database', project: saved });
      return true;
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message });
      return true;
    }
  }

  // 4. Votes endpoints
  if (pathname === '/api/votes' && method === 'GET') {
    const votes = getAllVotes();
    sendJson(res, 200, { ok: true, votes });
    return true;
  }

  if (pathname === '/api/votes/my-vote' && method === 'GET') {
    const wallet = url.searchParams.get('wallet');
    if (!wallet) {
      sendJson(res, 400, { ok: false, error: 'Query parameter wallet is required' });
      return true;
    }
    const vote = getVoteByVoter(wallet);
    sendJson(res, 200, { ok: true, vote });
    return true;
  }

  // Cast vote (requires account and recorded wallet)
  if (pathname === '/api/votes' && method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!body.projectId || !body.voterWallet || !body.signature) {
        sendJson(res, 400, {
          ok: false,
          error: 'Invalid vote payload. Project ID, voter wallet, and cryptographic signature are required.'
        });
        return true;
      }

      // Verify voter exists in database or auto-record account
      let user = getUserByWallet(body.voterWallet);
      if (!user) {
        user = saveUser({
          name: body.voterName || 'Verified Voter',
          walletAddress: body.voterWallet,
          avatar: body.voterAvatar,
          provider: body.voterProvider || 'google',
          role: 'voter'
        });
      }

      const vote = castVote(body);
      sendJson(res, 201, { ok: true, message: 'Vote cryptographically recorded in database', vote });
      return true;
    } catch (err) {
      sendJson(res, 500, { ok: false, error: err.message });
      return true;
    }
  }

  // 5. Database reset endpoint
  if (pathname === '/api/reset' && method === 'POST') {
    const stats = resetDatabase();
    sendJson(res, 200, { ok: true, message: 'Database reset to initial hackathon seed state', stats });
    return true;
  }

  return false;
}
