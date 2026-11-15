export default async function handler(req, res) {
  // CORS headers
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
    const { code, redirect_uri } = body || {};

    const clientId = process.env.VITE_GITHUB_CLIENT_ID || 'Ov23likydacnWhm2cBjL';
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.VITE_GITHUB_CLIENT_SECRET;

    if (!code) {
      return res.status(400).json({ ok: false, error: 'Missing authorization code' });
    }

    if (!clientSecret) {
      return res.status(400).json({ ok: false, error: 'GITHUB_CLIENT_SECRET not configured on server' });
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
      return res.status(400).json({
        ok: false,
        error: tokenData.error_description || tokenData.error || 'Failed to exchange token with GitHub'
      });
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Dart-Hackathon-App'
      }
    });

    if (!userRes.ok) {
      return res.status(400).json({ ok: false, error: 'Failed to fetch user profile from GitHub' });
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

    return res.status(200).json({
      ok: true,
      user: {
        name: userData.name || userData.login,
        email: email || `${userData.login}@users.noreply.github.com`,
        avatar: userData.avatar_url || `https://github.com/${userData.login}.png`,
        githubLogin: userData.login
      }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
