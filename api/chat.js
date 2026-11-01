// api/chat.js — Vercel Serverless Function
// YouTube live chat reader.
//   * Default  : keyless "scrape" method (same idea as your astrology project) — NO API key needed.
//   * Optional : official YouTube Data API v3 (if the browser sends an apiKey, or env YT_API_KEY is set).
// The browser calls POST /api/chat repeatedly and passes the returned `state` back each time,
// so this function is fully stateless (perfect for Vercel).

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// ---------- helpers ----------
function extractVideoId(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
    const host = u.hostname.replace(/^(www\.|m\.)/, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const m = u.pathname.match(/^\/(?:live|shorts|embed|v)\/([\w-]{11})/);
      if (m) return m[1];
    }
  } catch (e) {
    /* fallthrough */
  }
  return null;
}

function extractJsonObject(str, from) {
  const start = str.indexOf('{', from);
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < str.length; i++) {
    const c = str[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return str.slice(start, i + 1);
    }
  }
  return null;
}

function runsToText(runs) {
  if (!runs) return '';
  return runs
    .map((r) => {
      if (r.text) return r.text;
      if (r.emoji) {
        if (r.emoji.isCustomEmoji) return (r.emoji.shortcuts && r.emoji.shortcuts[0]) || '';
        return r.emoji.emojiId || '';
      }
      return '';
    })
    .join('');
}

function bigPhoto(url) {
  if (!url) return '';
  const u = url.startsWith('//') ? 'https:' + url : url;
  return u.replace(/=s\d+/, '=s96');
}

function pickContinuation(list) {
  for (const c of list || []) {
    const d =
      c.invalidationContinuationData ||
      c.timedContinuationData ||
      c.reloadContinuationData ||
      c.liveChatReplayContinuationData;
    if (d && d.continuation) return { token: d.continuation, timeoutMs: d.timeoutMs || 2000 };
  }
  return null;
}

function parseActions(actions) {
  const out = [];
  for (const a of actions || []) {
    const item = a.addChatItemAction && a.addChatItemAction.item;
    if (!item) continue;
    const r = item.liveChatTextMessageRenderer || item.liveChatPaidMessageRenderer;
    if (!r) continue;
    const text = runsToText(r.message && r.message.runs).trim();
    if (!text) continue;
    const name = ((r.authorName && (r.authorName.simpleText || runsToText(r.authorName.runs))) || 'Viewer').replace(/^@/, '');
    const thumbs = r.authorPhoto && r.authorPhoto.thumbnails;
    out.push({
      id: r.id,
      uid: r.authorExternalChannelId || name,
      name,
      photo: bigPhoto(thumbs && thumbs.length ? thumbs[thumbs.length - 1].url : ''),
      text,
      ts: Math.round(Number(r.timestampUsec) / 1000) || Date.now(),
    });
  }
  return out;
}

class ChatError extends Error {
  constructor(code, message, fatal) {
    super(message);
    this.code = code;
    this.fatal = !!fatal;
  }
}

// ---------- keyless (web) mode ----------
async function webInit(videoId) {
  const r = await fetch(`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'en-US,en;q=0.9',
      Cookie: 'CONSENT=YES+1; SOCS=CAI',
    },
  });
  if (!r.ok) throw new ChatError('HTTP', `YouTube page error (${r.status})`, true);
  const html = await r.text();
  const key = (html.match(/"INNERTUBE_API_KEY":"([^"]+)"/) || [])[1];
  const ver =
    (html.match(/"INNERTUBE_CONTEXT_CLIENT_VERSION":"([^"]+)"/) ||
      html.match(/"clientVersion":"([^"]+)"/) ||
      [])[1] || '2.20240501.00.00';
  const m = html.match(/(?:window\["ytInitialData"\]|var ytInitialData)\s*=\s*/);
  const jsonStr = m ? extractJsonObject(html, m.index + m[0].length - 1) : null;
  if (!key || !jsonStr) {
    throw new ChatError(
      'CHAT_UNAVAILABLE',
      'Live chat దొరకలేదు. Live మొదలైందా? Chat ON లో ఉందా? Link సరిగ్గా ఉందా? చూడండి.',
      true
    );
  }
  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new ChatError('PARSE', 'YouTube data చదవలేకపోయాం, మళ్లీ try చేస్తున్నాం…', true);
  }
  const lcr = data && data.contents && data.contents.liveChatRenderer;
  if (!lcr) {
    throw new ChatError(
      'CHAT_UNAVAILABLE',
      'ఈ video కి live chat లేదు (live కాదు / chat off / members only).',
      true
    );
  }
  const cont = pickContinuation(lcr.continuations);
  if (!cont) throw new ChatError('CHAT_UNAVAILABLE', 'Chat continuation దొరకలేదు.', true);
  return {
    state: { mode: 'web', key, ver, token: cont.token },
    messages: parseActions(lcr.actions),
    wait: Math.min(cont.timeoutMs, 3000),
  };
}

async function webPoll(state) {
  const r = await fetch(`https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${state.key}&prettyPrint=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
    body: JSON.stringify({
      context: { client: { clientName: 'WEB', clientVersion: state.ver, hl: 'en', gl: 'IN' } },
      continuation: state.token,
    }),
  });
  if (!r.ok) throw new ChatError('REINIT', 'reinit', false);
  const j = await r.json();
  const lcc = j && j.continuationContents && j.continuationContents.liveChatContinuation;
  if (!lcc) throw new ChatError('REINIT', 'reinit', false);
  const cont = pickContinuation(lcc.continuations);
  if (!cont) throw new ChatError('REINIT', 'reinit', false);
  return {
    state: { mode: 'web', key: state.key, ver: state.ver, token: cont.token },
    messages: parseActions(lcc.actions),
    wait: Math.max(1200, Math.min(cont.timeoutMs, 3000)),
  };
}

// ---------- official API mode ----------
async function ytApi(path, params, key) {
  const u = new URL('https://www.googleapis.com/youtube/v3/' + path);
  Object.keys(params).forEach((k) => params[k] != null && u.searchParams.set(k, params[k]));
  u.searchParams.set('key', key);
  const r = await fetch(u);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (j.error && j.error.message) || `YouTube API error (${r.status})`;
    const quota = /quota/i.test(msg);
    throw new ChatError('API_ERROR', 'API: ' + msg + (quota ? ' — daily quota అయిపోయింది, API key లేకుండా try చేయండి.' : ''), true);
  }
  return j;
}

function apiMessages(items) {
  const out = [];
  for (const it of items || []) {
    const sn = it.snippet || {};
    if (sn.type !== 'textMessageEvent') continue;
    const text = ((sn.textMessageDetails && sn.textMessageDetails.messageText) || sn.displayMessage || '').trim();
    if (!text) continue;
    const a = it.authorDetails || {};
    out.push({
      id: it.id,
      uid: a.channelId || a.displayName,
      name: (a.displayName || 'Viewer').replace(/^@/, ''),
      photo: a.profileImageUrl || '',
      text,
      ts: Date.parse(sn.publishedAt) || Date.now(),
    });
  }
  return out;
}

async function apiInit(videoId, apiKey) {
  const j = await ytApi('videos', { part: 'liveStreamingDetails', id: videoId }, apiKey);
  const chatId = j.items && j.items[0] && j.items[0].liveStreamingDetails && j.items[0].liveStreamingDetails.activeLiveChatId;
  if (!chatId) throw new ChatError('CHAT_UNAVAILABLE', 'Live chat దొరకలేదు (live మొదలవ్వలేదు లేదా video ID తప్పు).', true);
  const page = await apiPoll({ mode: 'api', chatId, pageToken: null }, apiKey);
  return page;
}

async function apiPoll(state, apiKey) {
  const j = await ytApi(
    'liveChat/messages',
    { liveChatId: state.chatId, part: 'snippet,authorDetails', maxResults: 200, pageToken: state.pageToken },
    apiKey
  );
  return {
    state: { mode: 'api', chatId: state.chatId, pageToken: j.nextPageToken },
    messages: apiMessages(j.items),
    wait: Math.max(3500, j.pollingIntervalMillis || 5000),
  };
}

// ---------- handler ----------
async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'POST only' });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  body = body || {};
  const apiKey = (body.apiKey || process.env.YT_API_KEY || '').trim();
  const videoId = extractVideoId(body.video);
  if (!videoId) {
    res.status(200).json({ ok: false, fatal: true, message: 'YouTube live link / video ID సరిగ్గా లేదు.' });
    return;
  }
  const state = body.state && body.state.mode ? body.state : null;
  try {
    let result;
    let initial = false;
    if (!state) {
      initial = true;
      if (apiKey) {
        result = await apiInit(videoId, apiKey);
      } else {
        result = await webInit(videoId);
      }
    } else if (state.mode === 'api') {
      result = await apiPoll(state, apiKey);
    } else {
      result = await webPoll(state);
    }
    res.status(200).json({ ok: true, initial, videoId, ...result });
  } catch (e) {
    if (e && e.code === 'REINIT') {
      res.status(200).json({ ok: false, reinit: true, message: 'reconnecting…' });
      return;
    }
    res.status(200).json({
      ok: false,
      fatal: !!(e && e.fatal),
      message: (e && e.message) || 'Unknown error',
    });
  }
}

module.exports = handler;
module.exports._test = { extractVideoId, extractJsonObject, parseActions, pickContinuation, apiMessages };
