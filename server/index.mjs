import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 8787);
const DATA_DIR = path.resolve(process.cwd(), 'server-data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SAVES_DIR = path.join(DATA_DIR, 'saves');

const sessions = new Map();

const usernamePattern = /^[a-zA-Z0-9_\u4e00-\u9fa5-]{3,24}$/;

app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

async function ensureStorage() {
  await fs.mkdir(SAVES_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, '[]\n', 'utf8');
  }
}

async function readUsers() {
  await ensureStorage();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}$${key}`;
}

function verifyPassword(password, stored) {
  const [salt, keyHex] = String(stored || '').split('$');
  if (!salt || !keyHex) return false;
  const expected = Buffer.from(keyHex, 'hex');
  const actual = crypto.scryptSync(password, salt, expected.length);
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

function issueToken(username) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, username);
  return token;
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const username = sessions.get(token);
  if (!username) return res.status(401).json({ error: '未登录或会话失效。' });
  req.username = username;
  next();
}

function validateCredentials(username, password) {
  if (!usernamePattern.test(username || '')) {
    return '用户名仅支持中英文、数字、下划线、短横线，长度 3-24。';
  }
  if (!password || String(password).length < 6) {
    return '密码至少 6 位。';
  }
  return null;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/register', async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  const invalidReason = validateCredentials(username, password);
  if (invalidReason) return res.status(400).json({ error: invalidReason });

  const users = await readUsers();
  if (users.some((u) => u.username === username)) {
    return res.status(409).json({ error: '用户名已存在。' });
  }

  users.push({
    username,
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  });
  await writeUsers(users);

  const token = issueToken(username);
  res.json({ token, username });
});

app.post('/api/auth/login', async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  const users = await readUsers();
  const user = users.find((u) => u.username === username);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: '用户名或密码错误。' });
  }
  const token = issueToken(username);
  res.json({ token, username });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ username: req.username });
});

app.get('/api/save', requireAuth, async (req, res) => {
  await ensureStorage();
  const filePath = path.join(SAVES_DIR, `${req.username}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    res.json({ data: parsed.data ?? null, updatedAt: parsed.updatedAt ?? null });
  } catch {
    res.json({ data: null, updatedAt: null });
  }
});

app.put('/api/save', requireAuth, async (req, res) => {
  const data = req.body?.data;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: '缺少有效存档数据。' });
  }
  await ensureStorage();
  const filePath = path.join(SAVES_DIR, `${req.username}.json`);
  const payload = {
    username: req.username,
    updatedAt: Date.now(),
    data,
  };
  await fs.writeFile(filePath, `${JSON.stringify(payload)}\n`, 'utf8');
  res.json({ ok: true, updatedAt: payload.updatedAt });
});

ensureStorage()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[save-server] listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[save-server] failed to start', err);
    process.exit(1);
  });
