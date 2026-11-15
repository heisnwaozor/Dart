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
