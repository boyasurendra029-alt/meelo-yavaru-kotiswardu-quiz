// game.js — Live కోటీశ్వర Quiz engine v2 (50 questions per live, state machine + UI)
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const CANCEL = { cancel: true };
  const PRIZES = window.PRIZES;
  const TOTAL = window.TOTAL_Q; // 50
  const TIER_NAMES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT', 'LEGEND'];
  const tierOf = (i) => Math.min(4, Math.floor(i / 10));
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };
  const params = new URLSearchParams(location.search);
  const SPEED = Math.max(1, parseFloat(params.get('fast')) || 1); // ?fast=N → N× faster (testing only)
  const DEV_LEVEL = Math.max(1, Math.min(TOTAL, parseInt(params.get('level') || '1', 10))) - 1;

  const S = {
    runId: 0,
    paused: false,
    skip: false,
    phase: 'idle',
    level: 0,
    q: null,
    qStart: 0,
    answers: new Map(),
    accepting: false,
    board: LS.get('kbc2.board', {}),
    usedSet: new Set(LS.get('kbc2.used', [])),
    sessionUsed: new Set(),
    catCount: {},
    lastCat: null,
    players: new Set(),
    chat: null,
    demo: false,
    cfg: LS.get('kbc2.cfg', { video: '', apiKey: '', qTime: 59, name: 'LIVE కోటీశ్వర QUIZ', speak: false, custom: '', keep: false }),
    custom: [],
    tickerList: [],
    chatStatus: { level: 'idle', text: 'Not connected' },
    scrollAnim: null,
    finalDone: false,
  };

  // ---------------- helpers ----------------
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtINR = (n) => '₹' + Number(n).toLocaleString('en-IN');
  function fmtShort(n) {
    if (n >= 1e7) return '₹' + +(n / 1e7).toFixed(2) + ' Cr';
    if (n >= 1e5) return '₹' + +(n / 1e5).toFixed(2) + ' L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }
  function hue(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
    return h;
  }
  function av(u, size) {
    const nm = u.name || '?';
    const init = Array.from(nm.trim())[0] || '?';
    const img = u.photo ? `<img src="${esc(u.photo)}" referrerpolicy="no-referrer" alt="" onerror="this.remove()">` : '';
    return `<div class="av" style="--c:hsl(${hue(nm)} 65% 42%);${size ? 'width:' + size + 'px;font-size:' + size * 0.42 + 'px' : ''}"><span>${esc(init.toUpperCase())}</span>${img}</div>`;
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // pause / skip / cancel aware wait → 'done' | 'skip'
  function wait(ms, onTick) {
    const my = S.runId;
    const real = ms / SPEED;
    return new Promise((res, rej) => {
      let left = real;
      let last = performance.now();
      const id = setInterval(() => {
        const t = performance.now();
        const dt = t - last;
        last = t;
        if (my !== S.runId) { clearInterval(id); rej(CANCEL); return; }
        if (!S.paused) left -= dt;
        if (onTick) onTick(Math.max(0, left / real), Math.max(0, left * SPEED));
        if (left <= 0) { clearInterval(id); res('done'); return; }
        if (S.skip) { S.skip = false; clearInterval(id); res('skip'); }
      }, 40);
    });
  }

  function animateNum(el, from, to, dur, fmt) {
    const t0 = performance.now();
    const f = fmt || fmtINR;
    function step(t) {
      const k = Math.min(1, (t - t0) / (dur / SPEED));
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      el.textContent = f(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = f(to);
    }
    requestAnimationFrame(step);
  }

  function fit(box, inner, start, min) {
    let size = start;
    inner.style.fontSize = size + 'px';
    const maxH = box.clientHeight - 4;
    let guard = 0;
    while (inner.offsetHeight > maxH && size > min && guard++ < 60) {
      size -= 1.5;
      inner.style.fontSize = size + 'px';
    }
  }

  // ---------------- stage scaling ----------------
  function rescale() {
    const s = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
    $('#stage').style.transform = `translate(-50%,-50%) scale(${s})`;
  }
  window.addEventListener('resize', rescale);
  rescale();

  // ---------------- confetti / coins / fireworks ----------------
  const fxc = $('#fx');
  const fctx = fxc.getContext('2d');
  let parts = [];
  let fxRunning = false;
  const COLORS = ['#ffd24a', '#ff9d00', '#35e0ff', '#ff4d5e', '#25d366', '#c77dff', '#ffffff'];
  function fxLoop() {
    fctx.clearRect(0, 0, 1080, 1920);
    parts = parts.filter((p) => p.life > 0 && p.y < 2000);
    for (const p of parts) {
      p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 1;
      fctx.save();
      fctx.globalAlpha = Math.min(1, p.life / 30);
      fctx.translate(p.x, p.y);
      fctx.rotate(p.rot);
      fctx.fillStyle = p.c;
      if (p.coin) {
        fctx.scale(Math.abs(Math.cos(p.rot * 2)) * 0.8 + 0.2, 1);
        fctx.beginPath(); fctx.arc(0, 0, p.s, 0, 7); fctx.fill();
        fctx.strokeStyle = '#a35a00'; fctx.lineWidth = 3; fctx.stroke();
      } else if (p.spark) {
        fctx.beginPath(); fctx.arc(0, 0, p.s, 0, 7); fctx.fill();
      } else {
        fctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      }
      fctx.restore();
    }
    if (parts.length) requestAnimationFrame(fxLoop);
    else { fxRunning = false; fctx.clearRect(0, 0, 1080, 1920); }
  }
  function kick() { if (!fxRunning) { fxRunning = true; requestAnimationFrame(fxLoop); } }
  function confetti(n, x, y, spread) {
    for (let i = 0; i < n; i++) {
      const a = (Math.random() * spread - spread / 2) - Math.PI / 2;
      const v = 8 + Math.random() * 16;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.35, drag: 0.992, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, s: 12 + Math.random() * 14, c: COLORS[(Math.random() * COLORS.length) | 0], life: 160 + Math.random() * 90 });
    }
    kick();
  }
  function confettiRain(n) {
    for (let i = 0; i < n; i++) {
      parts.push({ x: Math.random() * 1080, y: -30 - Math.random() * 400, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4, g: 0.05, drag: 1, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, s: 12 + Math.random() * 14, c: COLORS[(Math.random() * COLORS.length) | 0], life: 400 + Math.random() * 100 });
    }
    kick();
  }
  function coinShower(x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = (Math.random() * 2.4 - 1.2) - Math.PI / 2;
      const v = 10 + Math.random() * 16;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.55, drag: 0.99, rot: Math.random() * 6, vr: 0.25 + Math.random() * 0.2, s: 13 + Math.random() * 9, c: Math.random() < 0.5 ? '#ffd24a' : '#ffb52e', life: 110 + Math.random() * 40, coin: true });
    }
    kick();
  }
  function firework(x, y) {
    const c = COLORS[(Math.random() * COLORS.length) | 0];
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2;
      const v = 4 + Math.random() * 9;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.12, drag: 0.965, rot: 0, vr: 0, s: 3 + Math.random() * 3, c: Math.random() < 0.3 ? '#fff' : c, life: 60 + Math.random() * 30, spark: true });
    }
    kick();
  }

  // ---------------- sidebar / badge renderers ----------------
  function sortedBoard() {
    return Object.keys(S.board)
      .map((k) => Object.assign({ uid: k }, S.board[k]))
      .filter((u) => u.total > 0)
      .sort((a, b) => b.total - a.total || a.first - b.first);
  }

  function renderTop3(flashUids) {
    const top = sortedBoard().slice(0, 3);
    let html = '<div class="side-h">👑 TOP 3</div>';
    for (let i = 0; i < 3; i++) {
      const u = top[i];
      if (!u) {
        html += `<div class="t3 r${i + 1} empty"><div class="rk">${i + 1}</div><div class="av" style="width:84px;font-size:32px;--c:#3b2a80"><span>?</span></div><div class="nm">—</div><div class="am">₹0</div></div>`;
      } else {
        const fl = flashUids && flashUids.has(u.uid) ? ' flash' : '';
        html += `<div class="t3 r${i + 1}${fl}"><div class="rk">${i + 1}</div>${i === 0 ? '<div class="crown">👑</div>' : ''}${av(u, 84)}<div class="nm">${esc(u.name)}</div><div class="am">${fmtShort(u.total)}</div></div>`;
      }
    }
    $('#top3').innerHTML = html;
  }

  function renderProg(level) {
    const tier = tierOf(level);
    const pct = ((level + 1) / TOTAL) * 100;
    const box = $('#prog');
    if (!box.querySelector('.pbar')) {
      let ticks = '';
      for (let i = 1; i < 5; i++) ticks += `<b style="bottom:${i * 20}%"></b>`;
      box.innerHTML = `<div class="card" style="width:100%;flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;gap:6px"><div class="pn"></div><div class="tier"></div><div class="pbar"><i style="height:0%"></i>${ticks}</div></div>`;
    }
    box.querySelector('.pn').innerHTML = `${level + 1}<small>/${TOTAL}</small>`;
    box.querySelector('.tier').textContent = TIER_NAMES[tier];
    requestAnimationFrame(() => { box.querySelector('.pbar i').style.height = pct + '%'; });
  }

  function renderPlayers(bump) {
    const el = $('#players');
    el.innerHTML = `<div class="card${bump ? ' bump' : ''}" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center"><div class="pc2">${S.players.size}</div><div class="pl">👥 ఆడుతున్నవారు</div></div>`;
  }

  function showPanel(cls, html) {
    const p = $('#panel');
    if (S.scrollAnim) { S.scrollAnim.cancel(); S.scrollAnim = null; }
    p.className = 'panel v-' + cls;
    p.innerHTML = html;
    void p.offsetWidth;
    p.classList.add('show');
    $('#center').classList.add('panel-on');
  }
  function hidePanel() {
    if (S.scrollAnim) { S.scrollAnim.cancel(); S.scrollAnim = null; }
    $('#panel').classList.remove('show');
    $('#center').classList.remove('panel-on');
  }

  // auto-scroll a long list so EVERY winner is shown; returns total ms (0 = nothing to scroll)
  function startScroll(wrap, cols, delay) {
    const inner = wrap && wrap.firstElementChild;
    if (!inner) return 0;
    const dist = inner.scrollHeight - wrap.clientHeight;
    if (dist <= 6) return 0;
    const pxs = cols <= 3 ? 150 : cols === 4 ? 190 : 240;
    const dur = Math.min(34000, Math.max(3500, (dist / pxs) * 1000));
    S.scrollAnim = inner.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-dist}px)` }], { duration: dur / SPEED, delay: delay / SPEED, easing: 'linear', fill: 'forwards' });
    if (S.paused) S.scrollAnim.pause();
    return delay + dur;
  }

  let tickRaf = 0;
  function renderTicker() {
    if (tickRaf) return;
    tickRaf = requestAnimationFrame(() => {
      tickRaf = 0;
      $('#tkRow').innerHTML = S.tickerList.slice(0, 6).map((u) => `<div class="tk">${av(u, 56)}<div class="nm">${esc(u.name)}</div></div>`).join('');
    });
  }
  function setAnswered() { $('#answered').textContent = `${S.answers.size} మంది answer చేశారు`; }

  // ---------------- questions (50 per live, never repeating) ----------------
  function parseCustom(text) {
    if (!text || !text.trim()) return [];
    try {
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) return [];
      return arr.filter((x) => x && typeof x.q === 'string' && Array.isArray(x.o) && x.o.length === 4 && x.o.every((o) => typeof o === 'string'));
    } catch (e) { return []; }
  }

  function candidates(tier) {
    const out = [];
    window.QUESTIONS[tier].forEach((x) => out.push({ q: x.q, o: x.o, cat: 'gk' }));
    (window.GENERATED[tier] || []).forEach((g) => out.push({ q: g.q, a: g.a, d: g.d, cat: g.cat }));
    S.custom.forEach((c) => { if (!c.level || tierOf(Number(c.level) - 1) === tier) out.push({ q: c.q, o: c.o, cat: 'custom' }); });
    const seen = new Set(); // identical question text is only ever listed once
    return out.filter((c) => (seen.has(c.q) ? false : (seen.add(c.q), true)));
  }

  function pickQuestion(level) {
    const tier = tierOf(level);
    const all = candidates(tier).filter((c) => !S.sessionUsed.has(c.q)); // never twice in one live
    let fresh = all.filter((c) => !S.usedSet.has(c.q)); // and not in earlier lives either
    if (!fresh.length) { candidates(tier).forEach((c) => S.usedSet.delete(c.q)); fresh = all; }
    const capOk = (c) => c.cat === 'gk' || c.cat === 'custom' || (S.catCount[tier + ':' + c.cat] || 0) < 2;
    let pool = fresh.filter((c) => c.cat !== S.lastCat && capOk(c));
    if (!pool.length) pool = fresh.filter((c) => c.cat !== S.lastCat);
    if (!pool.length) pool = fresh;
    if (!pool.length) pool = candidates(tier);
    const item = pool[(Math.random() * pool.length) | 0];
    S.sessionUsed.add(item.q);
    S.usedSet.add(item.q);
    LS.set('kbc2.used', Array.from(S.usedSet).slice(-3000));
    S.lastCat = item.cat;
    S.catCount[tier + ':' + item.cat] = (S.catCount[tier + ':' + item.cat] || 0) + 1;
    let opts;
    if (item.o) {
      opts = item.o.map((t, i) => ({ t, correct: i === 0 }));
    } else {
      const wrong = shuffle(Array.from(new Set(item.d.filter((x) => x !== item.a)))).slice(0, 3);
      opts = [{ t: item.a, correct: true }].concat(wrong.map((t) => ({ t, correct: false })));
    }
    shuffle(opts);
    return { q: item.q, opts, correct: opts.findIndex((o) => o.correct) };
  }

  function parseChoice(text) {
    const t = String(text || '').trim().toLowerCase();
    if (!t || t.length > 14) return -1;
    const m = t.match(/^(?:option|opt|answer|ans)?\s*[:\-]?\s*\(?([abcd1-4])\)?[.)!]*$/);
    if (!m) return -1;
    const c = m[1];
    return 'abcd'.indexOf(c) >= 0 ? 'abcd'.indexOf(c) : parseInt(c, 10) - 1;
  }

  // ---------------- chat intake ----------------
  let lastPop = 0;
  function onChat(msgs) {
    if (!S.accepting) return;
    let added = false;
    for (const m of msgs) {
      const idx = parseChoice(m.text);
      if (idx < 0) continue;
      const uid = m.uid || m.name;
      if (S.answers.has(uid)) continue;
      S.answers.set(uid, { uid, name: m.name, photo: m.photo, choice: idx, t: performance.now() - S.qStart });
      if (!S.players.has(uid)) { S.players.add(uid); added = true; }
      S.tickerList.unshift({ name: m.name, photo: m.photo });
      if (S.tickerList.length > 8) S.tickerList.length = 8;
      const t = performance.now();
      if (t - lastPop > 140) { SFX.fx.chatPop(); lastPop = t; }
    }
    setAnswered();
    renderTicker();
    if (added) renderPlayers(false);
  }

  // ---------------- one question ----------------
  async function playQuestion(level) {
    S.level = level;
    const tier = tierOf(level);
    S.q = pickQuestion(level);
    const prize = PRIZES[level];
    const prev = level ? PRIZES[level - 1] : 0;
    renderProg(level);
    renderPlayers(false);
    $('#qBadgeN').textContent = `Q${level + 1}/${TOTAL}`;
    $('#answered').textContent = '0 మంది answer చేశారు';
    S.tickerList = [];
    $('#tkRow').innerHTML = '';

    // reset question UI (hidden behind the intro panel)
    $$('.opt').forEach((o) => { o.className = 'opt'; });
    $('#qtext').classList.add('hide');
    $('#timer').className = '';
    $('#timerNum').textContent = S.cfg.qTime;
    $('#ring').style.strokeDashoffset = 0;
    $('#phaseLabel').textContent = 'READY';
    const how = $('#howto');
    how.className = '';
    how.innerHTML = '💬 Chat లో <b>A</b> <b>B</b> <b>C</b> <b>D</b> అని type చేయండి';
    $('#qlevel').textContent = `ప్రశ్న ${level + 1}/${TOTAL} · ${TIER_NAMES[tier]} · ${fmtINR(prize)}`;
    $('#qtext').textContent = S.q.q;
    S.q.opts.forEach((o, i) => { $$('.otx')[i].textContent = o.t; });
    fitAll();

    // 1) intro: the prize climbs from the previous amount to the new one
    S.phase = 'intro';
    const newTier = level > 0 && level % 10 === 0;
    const mile = (level + 1) % 10 === 0;
    const last = level === TOTAL - 1;
    showPanel('intro', `<div class="intro"><div class="tierchip">${TIER_NAMES[tier]} · ప్రశ్న ${level + 1} / ${TOTAL}</div><div class="prize-label">💰 PRIZE MONEY</div><div class="prize-big" id="pBig">${fmtINR(prev)}</div><div class="up" id="pUp">▲ +${fmtINR(prize - prev)}</div>${mile ? `<div class="ms">${last ? '🔥 10 కోట్ల ప్రశ్న! 🔥' : '⭐ MILESTONE ⭐'}</div>` : ''}<div class="sub">${last ? 'ఇదే చివరి ప్రశ్న… ready అవ్వండి!' : newTier ? `కొత్త level: ${TIER_NAMES[tier]} 🔓` : 'ready అవ్వండి…'}</div></div>`);
    SFX.fx.intro(level);
    if (newTier) { SFX.fx.tierUp(); confetti(50, 540, 1000, 2.6); }
    await wait(600);
    SFX.fx.prizeRoll(2.0);
    animateNum($('#pBig'), prev, prize, 2000);
    animateNum($('#qBadgePrize'), prev, prize, 2000, fmtShort);
    await wait(2050);
    $('#pUp').classList.add('show');
    $('#pBig').classList.add('pop');
    SFX.fx.ding();
    coinShower(540, 820, mile ? 90 : 55);
    if (mile) { firework(300, 600); setTimeout(() => firework(780, 700), 400 / SPEED); SFX.fx.sparkle(); }
    await wait(mile ? 2600 : 1700);
    hidePanel();
    await wait(450);

    // 2) question + options reveal
    S.phase = 'question';
    $('#phaseLabel').textContent = 'QUESTION';
    $('#qtext').classList.remove('hide');
    SFX.fx.questionShow();
    if (S.cfg.speak) SFX.speak(S.q.q);
    await wait(S.cfg.speak ? 3500 : 1500);
    for (let i = 0; i < 4; i++) {
      $$('.opt')[i].classList.add('in');
      SFX.fx.optionPop(i);
      await wait(450);
    }
    await wait(400);

    // 3) answering window
    S.answers = new Map();
    S.accepting = true;
    S.qStart = performance.now();
    $('#phaseLabel').textContent = 'ANSWER NOW!';
    how.classList.add('big');
    SFX.startMusic();
    let lastSec = -1;
    await wait(S.cfg.qTime * 1000, (frac, leftMs) => {
      const sec = Math.ceil(leftMs / 1000);
      $('#ring').style.strokeDashoffset = (339.29 * (1 - frac)).toFixed(1);
      $('#timerNum').textContent = sec;
      $('#timer').className = sec <= 5 ? 'danger' : sec <= 10 ? 'warn' : '';
      if (sec !== lastSec) {
        lastSec = sec;
        if (sec <= 10 && sec > 0) SFX.fx.tick(sec <= 5);
      }
      SFX.setIntensity(1 - frac);
    });
    S.accepting = false;

    // 4) lock + suspense
    S.phase = 'lock';
    SFX.stopMusic();
    $('#timerNum').textContent = '0';
    $('#phaseLabel').textContent = 'LOCKED 🔒';
    how.className = '';
    how.innerHTML = `🔒 Answers లాక్ అయ్యాయి · <b>${S.answers.size}</b> మంది`;
    $$('.opt').forEach((o) => o.classList.add('locked'));
    SFX.fx.lock();
    await wait(1100);
    SFX.fx.suspense(2.2);
    const blink = setInterval(() => {
      $$('.opt').forEach((o) => o.classList.remove('blink'));
      $$('.opt')[(Math.random() * 4) | 0].classList.add('blink');
    }, 220 / Math.min(SPEED, 3));
    try { await wait(2300); } finally { clearInterval(blink); $$('.opt').forEach((o) => o.classList.remove('blink')); }

    // 5) reveal
    S.phase = 'reveal';
    const ci = S.q.correct;
    $$('.opt').forEach((o, i) => { o.classList.remove('locked'); o.classList.add(i === ci ? 'correct' : 'wrong'); });
    $('#phaseLabel').textContent = 'సరైన సమాధానం ✔';
    how.className = 'big';
    how.innerHTML = `✅ సరైన సమాధానం: <b>${'ABCD'[ci]}</b>`;
    SFX.fx.correct();
    confetti(36, 540, 760, 1.8);
    await wait(3600);

    // 6) score + show ALL correct chatters
    const winners = Array.from(S.answers.values()).filter((a) => a.choice === ci).sort((a, b) => a.t - b.t);
    const flash = new Set();
    const nowTs = Date.now();
    for (const w of winners) {
      const b = S.board[w.uid] || (S.board[w.uid] = { name: w.name, photo: w.photo, total: 0, correct: 0, first: nowTs });
      w.prev = b.total;
      b.total += prize;
      b.correct += 1;
      b.name = w.name;
      if (w.photo) b.photo = w.photo;
      flash.add(w.uid);
    }
    LS.set('kbc2.board', S.board);

    const n = winners.length;
    const cols = n <= 12 ? 3 : n <= 40 ? 4 : 5;
    const avSize = cols === 3 ? 108 : cols === 4 ? 82 : 64;
    S.phase = 'winners';
    const ansHtml = `<div class="pc"><div class="ans-line"><b>${'ABCD'[ci]}</b><span>${esc(S.q.opts[ci].t)}</span></div></div>`;
    if (!n) {
      showPanel('nowin', `<div class="p-title">${S.answers.size ? 'ఈసారి ఎవరూ సరిగ్గా చెప్పలేదు 😮' : 'ఎవరూ answer చేయలేదు 😴'}</div>${ansHtml}<div class="empty-msg">${S.answers.size ? 'తర్వాతి ప్రశ్న try చేయండి — all the best! 💪' : 'Chat లో <b style="color:#ffd24a">A / B / C / D</b> type చేయండి!'}</div>`);
      SFX.fx.wrongAll();
      await wait(4200);
    } else {
      const cards = winners.map((w, i) => `<div class="wcard" style="--i:${i}">${i === 0 ? '<div class="fast">⚡ FASTEST</div>' : ''}${av(w, avSize)}<div class="nm">${esc(w.name)}</div></div>`).join('');
      showPanel('winners', `<div class="p-title">🎉 సరిగ్గా చెప్పినవారు!</div><div class="p-sub"><b>${n}</b> మంది correct</div>${ansHtml}<div class="swrap" id="sw"><div class="sinner wg c${cols}">${cards}</div></div>`);
      SFX.fx.winnersIn();
      for (let i = 0; i < Math.min(n, 12); i++) setTimeout(() => SFX.fx.winnerPop(i), (220 * i + 300) / SPEED);
      const sm = startScroll($('#sw'), cols, 1600);
      await wait(sm ? sm + 900 : 2600 + 230 * Math.min(n, 12));

      // 7) earnings panel (everyone who was right, with the prize they won)
      S.phase = 'earn';
      if (n <= 8) {
        const erows = winners.map((w, i) => `<div class="erow" style="--i:${i}">${av(w, 84)}<div class="nm">${esc(w.name)}</div><div class="gain">+${fmtINR(prize)}</div><div class="tot"><small>TOTAL</small><span class="cu" data-from="${w.prev}" data-to="${w.prev + prize}">${fmtINR(w.prev)}</span></div></div>`).join('');
        showPanel('earn', `<div class="p-title">💰 ప్రైజ్ మనీ గెలుచుకున్నారు!</div><span class="prize-chip">${fmtINR(prize)}</span><div class="p-sub">${n} మంది కి ఒక్కొక్కరికి</div><div class="erows">${erows}</div>`);
        SFX.fx.sparkle();
        winners.forEach((_, i) => {
          setTimeout(() => {
            SFX.fx.coin(i);
            const el = $$('.cu')[i];
            if (el) animateNum(el, +el.dataset.from, +el.dataset.to, 900);
          }, (300 * i + 500) / SPEED);
        });
        coinShower(540, 700, 40);
        await wait(2600 + 320 * n);
      } else {
        const cards = winners.map((w, i) => `<div class="wcard" style="--i:${i}">${av(w, avSize)}<div class="nm">${esc(w.name)}</div><div class="gn">+${fmtShort(prize)}</div><div class="tt">${fmtShort(w.prev + prize)}</div></div>`).join('');
        showPanel('earn', `<div class="p-title">💰 ప్రైజ్ మనీ గెలుచుకున్నారు!</div><span class="prize-chip sm">${fmtINR(prize)}</span><div class="p-sub"><b>${n}</b> మంది కి ఒక్కొక్కరికి</div><div class="swrap" id="sw2"><div class="sinner wg c${cols}">${cards}</div></div>`);
        SFX.fx.sparkle();
        for (let i = 0; i < 8; i++) setTimeout(() => SFX.fx.coin(i), (260 * i + 300) / SPEED);
        coinShower(540, 700, 50);
        const sm2 = startScroll($('#sw2'), cols, 1400);
        await wait(sm2 ? sm2 + 900 : 3000);
      }
    }

    // 8) leaderboard
    renderTop3(flash);
    renderPlayers(true);
    const top = sortedBoard().slice(0, 10);
    if (top.length) {
      S.phase = 'leaderboard';
      showPanel('lb', `<div class="p-title">🏆 TOP 10 EARNERS</div><div class="p-sub">ప్రశ్న ${level + 1}/${TOTAL} తర్వాత</div><div class="lrows">${top.map((u, i) => lbRow(u, i)).join('')}</div>`);
      SFX.fx.leaderboard();
      top.forEach((_, i) => setTimeout(() => SFX.fx.rankPop(i), (160 * i + 200) / SPEED));
      await wait(4200 + 250 * top.length);
    }
    hidePanel();
    await wait(500);
  }

  function lbRow(u, i) {
    return `<div class="lrow r${i + 1}" style="--i:${i}"><div class="rk">${i + 1}</div>${av(u, 70)}<div class="nm">${esc(u.name)}</div><div class="lv">${fmtINR(u.total)}</div></div>`;
  }

  // ---------------- grand finale: thanks + Top 10 celebration ----------------
  async function finale() {
    S.phase = 'finale';
    S.finalDone = true;
    SFX.stopMusic();
    $('#phaseLabel').textContent = 'THANK YOU';
    const top = sortedBoard().slice(0, 10);
    const medals = ['🥇', '🥈', '🥉'];
    let body;
    if (!top.length) {
      body = `<div class="empty-msg">ఈ live లో ఎవరూ earn చేయలేదు 😅<br>కానీ మీ అందరికీ <b style="color:#ffd24a">ధన్యవాదాలు!</b> 🙏</div>`;
    } else {
      const pod = [1, 0, 2].filter((i) => top[i]).map((i) => {
        const u = top[i];
        return `<div class="pod p${i + 1}" style="--i:${i === 0 ? 2 : i === 1 ? 1 : 0}"><div class="medal">${medals[i]}</div>${av(u, i === 0 ? 150 : i === 1 ? 118 : 106)}<div class="nm">${esc(u.name)}</div><div class="am">${fmtINR(u.total)}</div></div>`;
      }).join('');
      body = `<div class="podium">${pod}</div><div class="lrows tight">${top.slice(3).map((u, i) => lbRow(u, i + 3)).join('')}</div>`;
    }
    showPanel('finale', `<div class="p-title">🎊 ధన్యవాదాలు! 🎊</div><div class="p-sub">FINAL · TOP 10 EARNERS 🏆</div><div class="finale-stats">👥 ${S.players.size} మంది ఆడారు · ${Math.min(TOTAL, S.level + 1)} ప్రశ్నలు</div>${body}<div class="thanks">మీరు అందరూ <b>Superstars</b> ⭐<br>వచ్చినందుకు, ఆడినందుకు <b>థాంక్యూ!</b> 🙏<br><b>Like 👍 Share 🔁 Subscribe 🔔</b> చేయండి!</div>`);
    SFX.fx.fanfare();
    SFX.fx.applause(6);
    confetti(130, 300, 1300, 2.4);
    confetti(130, 780, 1300, 2.4);
    confettiRain(150);
    coinShower(540, 1000, 80);
    if (S.cfg.speak) setTimeout(() => SFX.speak('అందరికీ ధన్యవాదాలు! Like, Share, Subscribe చేయండి!'), 3000);
    const fw = setInterval(() => { firework(200 + Math.random() * 680, 300 + Math.random() * 600); if (Math.random() < 0.5) SFX.fx.sparkle(); }, 700 / Math.min(SPEED, 3));
    const rain = setInterval(() => confettiRain(50), 2600 / Math.min(SPEED, 3));
    try {
      await wait(16000);
      clearInterval(fw); clearInterval(rain);
      for (;;) { // keep a gentle celebration on screen until the host starts a new show
        await wait(3500);
        firework(200 + Math.random() * 680, 300 + Math.random() * 600);
        if (Math.random() < 0.3) confettiRain(30);
      }
    } finally {
      clearInterval(fw); clearInterval(rain);
    }
  }

  // ---------------- show control ----------------
  function resetShowState(keepBoard) {
    if (!keepBoard) { S.board = {}; LS.set('kbc2.board', S.board); }
    S.players = new Set();
    S.sessionUsed = new Set();
    S.catCount = {};
    S.lastCat = null;
    S.finalDone = false;
    parts = [];
    renderTop3();
    renderPlayers(false);
    $('#prog').innerHTML = '';
  }

  async function runShow(fromLevel) {
    const my = ++S.runId;
    S.paused = false;
    S.skip = false;
    $('#pauseBadge').hidden = true;
    hidePanel();
    try {
      for (let i = fromLevel || 0; i < TOTAL && my === S.runId; i++) await playQuestion(i);
      if (my === S.runId) await finale();
    } catch (e) {
      if (e !== CANCEL) console.error(e);
    }
  }

  async function endShow() {
    ++S.runId;
    S.accepting = false;
    S.paused = false;
    $('#pauseBadge').hidden = true;
    SFX.stopMusic();
    try { await finale(); } catch (e) { if (e !== CANCEL) console.error(e); }
  }

  function fitAll() {
    const len = S.q.q.length;
    fit($('#qbox'), $('#qtext'), len > 100 ? 40 : 46, 24);
    $$('.obox').forEach((b) => fit(b, b.querySelector('.otx'), 34, 20));
  }

  // ---------------- setup / start / stop ----------------
  function extractId(input) {
    const s = String(input || '').trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    try {
      const u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s);
      const host = u.hostname.replace(/^(www\.|m\.)/, '');
      if (host === 'youtu.be') { const id = u.pathname.slice(1).split('/')[0]; return /^[\w-]{11}$/.test(id) ? id : null; }
      if (host.endsWith('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v && /^[\w-]{11}$/.test(v)) return v;
        const m = u.pathname.match(/^\/(?:live|shorts|embed|v)\/([\w-]{11})/);
        if (m) return m[1];
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  function fillSetup() {
    $('#inVideo').value = S.cfg.video || '';
    $('#inKey').value = S.cfg.apiKey || '';
    $('#inTime').value = S.cfg.qTime || 59;
    $('#inName').value = S.cfg.name || 'LIVE కోటీశ్వర QUIZ';
    $('#chkSpeak').checked = !!S.cfg.speak;
    $('#chkKeep').checked = !!S.cfg.keep;
    $('#inCustom').value = S.cfg.custom || '';
  }

  function setupError(msg) {
    const e = $('#setupErr');
    e.textContent = msg;
    e.hidden = !msg;
  }

  function begin(demo) {
    setupError('');
    const video = $('#inVideo').value.trim();
    const customTxt = $('#inCustom').value.trim();
    if (!demo && !extractId(video)) {
      setupError('YouTube live link సరిగ్గా లేదు. ఉదా: https://www.youtube.com/watch?v=xxxxxxxxxxx లేదా https://youtube.com/live/xxxxxxxxxxx');
      return;
    }
    if (customTxt && !parseCustom(customTxt).length) {
      setupError('Own questions JSON సరిగ్గా లేదు (ప్రతి question కి "q" మరియు 4 options "o" ఉండాలి). లేదా ఆ box ఖాళీగా వదిలేయండి.');
      return;
    }
    S.cfg = {
      video,
      apiKey: $('#inKey').value.trim(),
      qTime: Math.max(10, Math.min(120, parseInt($('#inTime').value, 10) || 59)),
      name: $('#inName').value.trim() || 'LIVE కోటీశ్వర QUIZ',
      speak: $('#chkSpeak').checked,
      keep: $('#chkKeep').checked,
      custom: customTxt,
    };
    LS.set('kbc2.cfg', S.cfg);
    S.custom = parseCustom(customTxt);
    S.demo = !!demo;
    $('#showName').textContent = S.cfg.name;
    SFX.init();
    $('#setup').classList.add('hidden');
    resetShowState(S.cfg.keep);
    startChat();
    $('#host').hidden = true;
    runShow(DEV_LEVEL);
    pokeGear();
  }

  function startChat() {
    if (S.chat) S.chat.stop();
    const onStatus = (st) => {
      S.chatStatus = st;
      $('#gearDot').className = st.level === 'ok' ? 'ok' : st.level === 'error' ? 'error' : '';
      updateHostStatus();
    };
    if (S.demo) {
      S.chat = new window.DemoChat({ onMessages: onChat, onStatus, hint: () => (S.accepting && S.q ? 'ABCD'[S.q.correct] : null) });
    } else {
      S.chat = new window.ChatClient({ video: extractId(S.cfg.video), apiKey: S.cfg.apiKey, onMessages: onChat, onStatus });
    }
    S.chat.start();
  }

  function stopAll() {
    S.runId++;
    S.accepting = false;
    if (S.chat) S.chat.stop();
    SFX.stopMusic();
    hidePanel();
    $('#pauseBadge').hidden = true;
    parts = [];
    fillSetup();
    $('#setup').classList.remove('hidden');
  }

  // ---------------- host controls ----------------
  function updateHostStatus() {
    const st = S.chatStatus;
    $('#hostStatus').textContent = `${S.demo ? '🧪 DEMO' : '📡 LIVE'} · ${st.text} · Q${S.level + 1}/${TOTAL} · 👥 ${S.players.size}${S.paused ? ' · ⏸ paused' : ''}`;
  }
  function togglePause() {
    S.paused = !S.paused;
    $('#pauseBadge').hidden = !S.paused;
    if (S.paused) {
      SFX.stopMusic();
      if (S.scrollAnim) S.scrollAnim.pause();
    } else {
      if (S.phase === 'question' && S.accepting) SFX.startMusic();
      if (S.scrollAnim) S.scrollAnim.play();
    }
    updateHostStatus();
  }
  function pokeGear() {
    const g = $('#gear');
    g.classList.add('vis');
    clearTimeout(pokeGear.t);
    pokeGear.t = setTimeout(() => g.classList.remove('vis'), 3000);
  }
  window.addEventListener('mousemove', pokeGear);
  window.addEventListener('touchstart', pokeGear, { passive: true });

  $('#gear').addEventListener('click', () => { $('#host').hidden = !$('#host').hidden; updateHostStatus(); });
  $('#hPause').addEventListener('click', togglePause);
  $('#hSkip').addEventListener('click', () => { S.skip = true; });
  $('#hEnd').addEventListener('click', () => { if (confirm('Show ముగించి Top 10 celebration చూపించాలా?')) endShow(); });
  $('#hNew').addEventListener('click', () => { if (confirm('కొత్త show (Q1 నుంచి, leaderboard reset) మొదలు పెట్టాలా?')) { ++S.runId; hidePanel(); resetShowState(false); runShow(0); } });
  $('#hGuide').addEventListener('click', () => { const g = $('#safeguide'); g.hidden = !g.hidden; });
  $('#hReset').addEventListener('click', () => { if (confirm('Leaderboard మొత్తం clear చేయాలా?')) { S.board = {}; LS.set('kbc2.board', S.board); renderTop3(); } });
  $('#hTest').addEventListener('click', () => { SFX.init(); SFX.fx.correct(); });
  $('#hStop').addEventListener('click', stopAll);
  $('#vSfx').addEventListener('input', (e) => SFX.setSfxVolume(+e.target.value));
  $('#vMusic').addEventListener('input', (e) => SFX.setMusicVolume(+e.target.value));
  window.addEventListener('keydown', (e) => {
    if (/INPUT|TEXTAREA/.test(e.target.tagName || '')) return;
    if (!$('#setup').classList.contains('hidden')) return;
    const k = e.key.toLowerCase();
    if (k === 'h') { $('#host').hidden = !$('#host').hidden; updateHostStatus(); }
    else if (k === ' ') { e.preventDefault(); togglePause(); }
    else if (k === 'n') { S.skip = true; }
    else if (k === 'g') { const g = $('#safeguide'); g.hidden = !g.hidden; }
  });

  $('#btnStart').addEventListener('click', () => begin(false));
  $('#btnDemo').addEventListener('click', () => begin(true));

  // test hooks (used by automated tests; harmless in production)
  window.__kbc = { S, onChat, parseChoice, extractId, pickQuestion, TOTAL };

  // ---------------- boot ----------------
  fillSetup();
  renderTop3();
  renderPlayers(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (S.q) fitAll(); });
  if (params.get('autostart') === 'demo') setTimeout(() => begin(true), 150);
})();
