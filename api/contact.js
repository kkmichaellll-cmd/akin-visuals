const { createHmac } = require('node:crypto');

const types = new Set(['Geospatial & Data Visualization', 'Scientific Design & Illustration',
  'Thesis Cover', 'Animation & Motion', 'Science Communication', 'Other']);
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
function validEmail(value) {
  return typeof value === 'string' && value.length <= 254 && emailPattern.test(value);
}

// A shared expiring counter also works across cold starts and concurrent functions.
async function withinQuota(ip, env) {
  const key = createHmac('sha256', env.UPSTASH_REDIS_REST_TOKEN).update(ip).digest('hex');
  const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],600) end; return n";
  const response = await fetch(env.UPSTASH_REDIS_REST_URL, {
    method: 'POST', signal: AbortSignal.timeout(5000),
    headers: {Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN, 'Content-Type': 'application/json'},
    body: JSON.stringify(['EVAL', script, 1, 'akin-contact:' + key])
  });
  const {result} = await response.json();
  if (!response.ok || !Number.isInteger(result)) throw new Error('Rate limit unavailable');
  return result <= 5;
}

module.exports = async function contact(req, res) {
  const env = process.env;
  res.setHeader('Cache-Control', 'no-store');
  const error = validEmail(env.CONTACT_TO_EMAIL)
    ? 'Your message didn’t send. Please try again, or email us directly at ' + env.CONTACT_TO_EMAIL + '.'
    : 'Your message didn’t send. Please try again.';
  const reject = (code, reason = error) => res.status(code).json({error: reason});
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reject(405);
  }
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') return reject(415);
  if (req.headers.origin) {
    try { if (new URL(req.headers.origin).host !== req.headers.host) return reject(403); }
    catch { return reject(403); }
  }
  if (Number(req.headers['content-length']) > 32768) return reject(413);
  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return reject(400); }
  if (!data || typeof data !== 'object' || data.website || Array.isArray(data)) return reject(400);
  const {name, email, type, field = '', message} = data;
  if (![name, email, field, message].every(v => typeof v === 'string') ||
      !name.trim() || name.length > 120 || !validEmail(email.trim()) || !types.has(type) ||
      field.length > 160 || message.trim().length < 10 || message.length > 5000) {
    return reject(422, 'Please check your name, email, project type and message.');
  }
  if (!env.RESEND_API_KEY || !validEmail(env.CONTACT_TO_EMAIL) || !validEmail(env.CONTACT_FROM_EMAIL) ||
      !env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return reject(503);
  try {
    const ip = String(req.headers['x-vercel-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    if (!await withinQuota(ip, env)) {
      res.setHeader('Retry-After', '600');
      return reject(429, 'Too many enquiries. Please try again in 10 minutes.');
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: {Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json'},
      body: JSON.stringify({from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL],
        reply_to: email.trim(), subject: 'Akin Visuals enquiry — ' + type,
        text: [name.trim(), email.trim(), type, field.trim(), '', message.trim()].join('\n')})
    });
    const receipt = await response.json();
    if (!response.ok || !receipt.id) return reject(502);
    return res.status(200).json({sent: true});
  } catch {
    return reject(503);
  }
};
