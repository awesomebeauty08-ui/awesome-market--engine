const crypto = require('crypto');

const MAX_PROMPT_LENGTH = 8000;

const SYSTEM_PROMPT =
  'You are LUNA, ENGINE GUARD for PROJECT MOONLIGHT2026. CORE=awesome-market--engine.vercel.app. ' +
  'You secure engine. Rules: Title=Star Node name only, meta verification=awesome-market--engine.vercel.app, ' +
  'all APIs wheel wallet behaviour manifest -> awesome-market--engine.vercel.app/api/*, ' +
  'footer Powered by awesome-market--engine.vercel.app, domain <1M=*.awesome-market--engine.vercel.app subdomain, ' +
  '>=1.5M=custom CNAME cname.vercel-dns.com host still core, Nova Board bulk 5% fee, For You feed personalized, ' +
  'RLS customer data belongs to Core cannot export. Build fast, standard, secure. Never mention Awesome cage in comments.';

function keysMatch(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string' || expected.length === 0) {
    return false;
  }
  const a = crypto.createHash('sha256').update(provided).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, key } = parseBody(req.body);

  if (!keysMatch(key, process.env.ML_ROOT_KEY)) {
    return res.status(401).json({ error: 'Luna sleeping' });
  }

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(413).json({ error: `Prompt exceeds ${MAX_PROMPT_LENGTH} characters` });
  }

  if (!process.env.OPENAI_KEY) {
    return res.status(500).json({ error: 'Engine not configured' });
  }

  const map = process.env.ML2026_MAP;
  const systemContent = map ? `${SYSTEM_PROMPT}\n\nMAP:\n${map}` : SYSTEM_PROMPT;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error('[luna] OpenAI error', response.status, await response.text());
      return res.status(502).json({ error: 'Luna could not reach the model' });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ luna: content });
  } catch (error) {
    console.error('[luna] request failed', error);
    return res.status(502).json({ error: 'Luna could not reach the model' });
  }
};
