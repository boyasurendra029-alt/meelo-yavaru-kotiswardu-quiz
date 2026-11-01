// audio.js — all sounds are synthesized with WebAudio (no mp3 files needed).
window.SFX = (function () {
  let ctx = null;
  let master, sfxBus, musicBus, reverbSend;
  let sfxVol = 0.9;
  let musicVol = 0.55;
  let enabled = true;

  const N = (n) => 440 * Math.pow(2, (n - 69) / 12); // midi -> Hz

  function init() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 6;
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(comp);
    comp.connect(ctx.destination);
    sfxBus = ctx.createGain();
    sfxBus.gain.value = sfxVol;
    sfxBus.connect(master);
    musicBus = ctx.createGain();
    musicBus.gain.value = musicVol;
    musicBus.connect(master);
    // simple generated reverb
    const len = ctx.sampleRate * 1.8;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const conv = ctx.createConvolver();
    conv.buffer = ir;
    reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.28;
    reverbSend.connect(conv);
    conv.connect(master);
  }

  function now() {
    return ctx ? ctx.currentTime : 0;
  }

  // basic tone with envelope
  function tone(freq, t0, dur, o) {
    if (!ctx || !enabled) return;
    o = o || {};
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.slideTo), t0 + dur);
    if (o.detune) osc.detune.value = o.detune;
    const vol = (o.vol == null ? 0.2 : o.vol);
    const a = o.attack == null ? 0.008 : o.attack;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let out = osc;
    if (o.lp) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(o.lp, t0);
      if (o.lpTo) f.frequency.exponentialRampToValueAtTime(o.lpTo, t0 + dur);
      osc.connect(f);
      out = f;
    }
    out.connect(g);
    g.connect(o.bus || sfxBus);
    if (o.wet) {
      const s = ctx.createGain();
      s.gain.value = o.wet;
      g.connect(s);
      s.connect(reverbSend);
    }
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noise(t0, dur, o) {
    if (!ctx || !enabled) return;
    o = o || {};
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = o.type || 'bandpass';
    f.frequency.setValueAtTime(o.f0 || 1000, t0);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t0 + dur);
    f.Q.value = o.q || 0.8;
    const g = ctx.createGain();
    const vol = o.vol == null ? 0.2 : o.vol;
    g.gain.setValueAtTime(0.0001, t0);
    if (o.rise) {
      g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.92);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    } else {
      g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    }
    src.connect(f);
    f.connect(g);
    g.connect(o.bus || sfxBus);
    if (o.wet) {
      const s = ctx.createGain();
      s.gain.value = o.wet;
      g.connect(s);
      s.connect(reverbSend);
    }
    src.start(t0);
    src.stop(t0 + dur + 0.05);
  }

  function chord(notes, t0, dur, o) {
    o = o || {};
    notes.forEach((n, i) => {
      tone(N(n), t0, dur, { type: o.type || 'sawtooth', vol: o.vol || 0.08, lp: o.lp || 2400, lpTo: o.lpTo, wet: o.wet == null ? 0.5 : o.wet, attack: o.attack || 0.02, detune: (i % 2 ? 6 : -6) });
    });
  }

  // ---------------- one-shot effects ----------------
  const fx = {
    // big dramatic sting when a new question level starts
    intro(level) {
      const t = now() + 0.02;
      noise(t, 1.4, { type: 'bandpass', f0: 300, f1: 5000, vol: 0.12, rise: true, wet: 0.4 });
      tone(N(36), t, 2.0, { type: 'sawtooth', vol: 0.18, lp: 400, lpTo: 120 });
      const base = 60 + (level % 4);
      [0, 3, 7, 12, 15, 19].forEach((n, i) => tone(N(base + n), t + 0.12 * i, 0.5, { type: 'triangle', vol: 0.12, wet: 0.5 }));
      chord([base - 12, base - 5, base, base + 4, base + 7], t + 0.85, 1.6, { vol: 0.07, lp: 2600, wet: 0.7 });
      noise(t + 0.85, 0.5, { type: 'highpass', f0: 6000, vol: 0.06, wet: 0.5 });
    },
    optionPop(i) {
      const t = now();
      tone(N(72 + i * 3), t, 0.18, { type: 'triangle', vol: 0.14, wet: 0.3 });
      tone(N(84 + i * 3), t + 0.04, 0.12, { type: 'sine', vol: 0.06 });
    },
    questionShow() {
      const t = now();
      noise(t, 0.4, { type: 'bandpass', f0: 800, f1: 3000, q: 1.2, vol: 0.1, wet: 0.3 });
      tone(N(79), t + 0.05, 0.5, { type: 'sine', vol: 0.12, wet: 0.5 });
    },
    tick(urgent) {
      const t = now();
      if (urgent) {
        tone(1900, t, 0.05, { type: 'square', vol: 0.1, lp: 5000 });
        tone(950, t, 0.08, { type: 'sine', vol: 0.12 });
      } else {
        tone(1200, t, 0.04, { type: 'square', vol: 0.045, lp: 3500 });
      }
    },
    chatPop() {
      const t = now();
      tone(600 + Math.random() * 500, t, 0.07, { type: 'sine', vol: 0.05, slideTo: 1300 });
    },
    lock() {
      const t = now();
      tone(N(31), t, 1.4, { type: 'sine', vol: 0.5, slideTo: 28 });
      tone(N(43), t, 0.6, { type: 'sawtooth', vol: 0.12, lp: 700, wet: 0.5 });
      noise(t, 0.35, { type: 'bandpass', f0: 2500, f1: 400, q: 2, vol: 0.2, wet: 0.5 });
      tone(N(91), t, 0.9, { type: 'triangle', vol: 0.06, wet: 0.8 });
    },
    suspense(dur) {
      // rising riser while waiting for the reveal
      const t = now();
      noise(t, dur, { type: 'bandpass', f0: 200, f1: 4500, q: 1.5, vol: 0.14, rise: true, wet: 0.3 });
      tone(N(48), t, dur, { type: 'sawtooth', vol: 0.1, slideTo: N(60), lp: 500, lpTo: 2200 });
      for (let i = 0; i < Math.floor(dur * 3); i++) tone(80, t + i / 3, 0.2, { type: 'sine', vol: 0.4, slideTo: 40 });
    },
    correct() {
      const t = now() + 0.02;
      chord([60, 64, 67, 72, 76], t, 2.2, { type: 'sawtooth', vol: 0.09, lp: 3500, wet: 0.7 });
      tone(N(48), t, 1.6, { type: 'sine', vol: 0.3 });
      [72, 76, 79, 84, 88, 91, 96].forEach((n, i) => tone(N(n), t + 0.07 * i, 0.4, { type: 'triangle', vol: 0.09, wet: 0.7 }));
      noise(t, 0.9, { type: 'highpass', f0: 5000, vol: 0.09, wet: 0.6 });
    },
    wrongAll() {
      const t = now();
      [64, 62, 60, 55].forEach((n, i) => tone(N(n), t + i * 0.22, 0.45, { type: 'sawtooth', vol: 0.1, lp: 900, wet: 0.4 }));
    },
    winnersIn() {
      const t = now();
      noise(t, 0.6, { type: 'bandpass', f0: 400, f1: 3500, vol: 0.1, wet: 0.3 });
      tone(N(67), t, 0.3, { type: 'triangle', vol: 0.12, wet: 0.5 });
      tone(N(74), t + 0.12, 0.5, { type: 'triangle', vol: 0.12, wet: 0.5 });
    },
    winnerPop(i) {
      const sc = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26];
      const t = now();
      tone(N(72 + sc[i % sc.length] % 18), t, 0.28, { type: 'triangle', vol: 0.11, wet: 0.5 });
    },
    coin(i) {
      const t = now();
      tone(N(88), t, 0.12, { type: 'square', vol: 0.05, lp: 6000 });
      tone(N(95), t + 0.07, 0.4, { type: 'square', vol: 0.05, lp: 6000, wet: 0.5 });
      noise(t, 0.1, { type: 'highpass', f0: 7000, vol: 0.04 });
    },
    countTick() {
      tone(N(96) + Math.random() * 30, now(), 0.03, { type: 'square', vol: 0.025, lp: 7000 });
    },
    leaderboard() {
      const t = now() + 0.02;
      chord([55, 62, 67, 71], t, 1.0, { type: 'sawtooth', vol: 0.08, lp: 2200, wet: 0.7 });
      chord([57, 64, 69, 73], t + 0.45, 1.8, { type: 'sawtooth', vol: 0.08, lp: 3000, wet: 0.8 });
      tone(N(45), t, 2.2, { type: 'sine', vol: 0.3 });
    },
    rankPop(i) {
      tone(N(64 + (9 - i)), now(), 0.14, { type: 'triangle', vol: 0.07, wet: 0.3 });
    },
    fanfare() {
      const t = now() + 0.02;
      const m = [
        [0, 60, 0.18], [0.2, 60, 0.18], [0.4, 60, 0.18], [0.6, 64, 0.5], [1.15, 62, 0.2], [1.35, 67, 0.9],
        [2.3, 64, 0.2], [2.5, 67, 0.2], [2.7, 72, 1.4],
      ];
      m.forEach(([dt, n, d]) => {
        tone(N(n), t + dt, d, { type: 'sawtooth', vol: 0.1, lp: 3000, wet: 0.7 });
        tone(N(n - 12), t + dt, d, { type: 'square', vol: 0.05, lp: 1500, wet: 0.5 });
      });
      chord([48, 55, 60, 64, 67, 72], t + 2.7, 2.6, { vol: 0.09, lp: 3800, wet: 0.9 });
      noise(t + 2.7, 1.6, { type: 'highpass', f0: 4000, vol: 0.12, wet: 0.7 });
      for (let i = 0; i < 20; i++) tone(N(84 + (i * 7) % 14), t + 2.9 + i * 0.07, 0.3, { type: 'triangle', vol: 0.05, wet: 0.7 });
    },
    boom() {
      const t = now();
      tone(N(38), t, 1.2, { type: 'sine', vol: 0.5, slideTo: 25 });
      noise(t, 0.5, { type: 'lowpass', f0: 3000, f1: 200, vol: 0.25, wet: 0.5 });
    },
    sparkle() {
      const t = now();
      for (let i = 0; i < 5; i++) tone(N(90 + Math.floor(Math.random() * 12)), t + i * 0.05, 0.22, { type: 'triangle', vol: 0.05, wet: 0.6 });
    },
    applause(dur) {
      const t = now();
      for (let i = 0; i < dur * 22; i++) {
        noise(t + Math.random() * dur, 0.05 + Math.random() * 0.05, {
          type: 'bandpass',
          f0: 1200 + Math.random() * 3000,
          q: 0.7,
          vol: 0.035 + Math.random() * 0.03,
          wet: 0.2,
        });
      }
    },
    // prize counter rolling up: accelerating ticks with a rising pitch
    prizeRoll(dur) {
      const t = now() + 0.02;
      const n = Math.max(12, Math.round(dur * 16));
      for (let i = 0; i < n; i++) {
        const k = i / n;
        const when = t + dur * Math.pow(k, 0.85);
        tone(700 + 1900 * k, when, 0.05, { type: 'square', vol: 0.035 + 0.03 * k, lp: 6000 });
        if (i % 3 === 0) tone(N(84 + Math.floor(k * 12)), when, 0.12, { type: 'triangle', vol: 0.04, wet: 0.4 });
      }
      noise(t, dur, { type: 'bandpass', f0: 400, f1: 6000, q: 1.2, vol: 0.07, rise: true, wet: 0.3 });
    },
    // bright bell "ding" when the prize lands
    ding() {
      const t = now() + 0.01;
      [N(88), N(95), N(100), N(107)].forEach((f, i) => tone(f, t + i * 0.03, 1.4, { type: 'sine', vol: 0.12 - i * 0.02, wet: 0.8 }));
      tone(N(52), t, 0.9, { type: 'sine', vol: 0.3, slideTo: N(40) });
      noise(t, 0.5, { type: 'highpass', f0: 7000, vol: 0.07, wet: 0.5 });
    },
    // entering a new difficulty tier (every 10 questions)
    tierUp() {
      const t = now() + 0.02;
      [60, 64, 67, 72, 76, 79, 84].forEach((n, i) => tone(N(n), t + i * 0.09, 0.5, { type: 'sawtooth', vol: 0.07, lp: 3200, wet: 0.7 }));
      chord([48, 55, 60, 64, 67, 72], t + 0.7, 1.8, { vol: 0.08, lp: 3500, wet: 0.9 });
      noise(t + 0.7, 1.0, { type: 'highpass', f0: 5000, vol: 0.08, wet: 0.6 });
    },
    whoosh() {
      noise(now(), 0.5, { type: 'bandpass', f0: 500, f1: 3500, q: 1, vol: 0.1, wet: 0.3 });
    },
    // price counter rolling up: k = 0..1 progress, pitch climbs
    priceTick(k) {
      const t = now();
      const n = 67 + Math.round(k * 26);
      tone(N(n), t, 0.07, { type: 'triangle', vol: 0.1 + 0.05 * k, wet: 0.25 });
      tone(N(n + 12), t, 0.04, { type: 'square', vol: 0.02, lp: 4000 });
    },
    priceRiseStart() {
      const t = now();
      noise(t, 1.9, { type: 'bandpass', f0: 300, f1: 6000, q: 1.2, vol: 0.09, rise: true, wet: 0.3 });
      tone(N(48), t, 1.9, { type: 'sawtooth', vol: 0.07, slideTo: N(72), lp: 600, lpTo: 3000, wet: 0.4 });
    },
    priceLand(big) {
      const t = now() + 0.01;
      tone(N(36), t, 0.9, { type: 'sine', vol: 0.4, slideTo: 30 });
      chord(big ? [60, 64, 67, 72, 76, 79] : [60, 64, 67, 72], t, big ? 2.2 : 1.3, { vol: 0.08, lp: 3500, wet: 0.8 });
      noise(t, 0.5, { type: 'highpass', f0: 6000, vol: 0.09, wet: 0.5 });
      for (let i = 0; i < (big ? 14 : 6); i++) tone(N(86 + (i * 5) % 12), t + 0.05 + i * 0.06, 0.25, { type: 'triangle', vol: 0.05, wet: 0.6 });
    },
    page() {
      noise(now(), 0.25, { type: 'bandpass', f0: 1200, f1: 400, q: 1, vol: 0.07, wet: 0.2 });
      tone(N(79), now() + 0.02, 0.12, { type: 'sine', vol: 0.06, wet: 0.4 });
    },
    halfway() {
      const t = now();
      tone(N(72), t, 0.35, { type: 'triangle', vol: 0.09, wet: 0.6 });
      tone(N(79), t + 0.12, 0.45, { type: 'triangle', vol: 0.09, wet: 0.6 });
    },
  };

  // ---------------- suspense music bed (lookahead scheduler) ----------------
  let musicTimer = null;
  let beatIdx = 0;
  let nextBeat = 0;
  let bpm = 72;
  let drone = null;
  let intensityTarget = 0;

  function startMusic() {
    if (!ctx || !enabled || musicTimer) return;
    beatIdx = 0;
    nextBeat = now() + 0.1;
    bpm = 72;
    // drone pad
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o1.type = 'sawtooth';
    o2.type = 'sawtooth';
    o1.frequency.value = N(36);
    o2.frequency.value = N(36) * 1.005;
    f.type = 'lowpass';
    f.frequency.value = 260;
    g.gain.setValueAtTime(0.0001, now());
    g.gain.exponentialRampToValueAtTime(0.14, now() + 1.2);
    o1.connect(f);
    o2.connect(f);
    f.connect(g);
    g.connect(musicBus);
    o1.start();
    o2.start();
    drone = { o1, o2, f, g };
    musicTimer = setInterval(schedule, 60);
  }

  function schedule() {
    if (!ctx) return;
    const ahead = now() + 0.25;
    const arp = [48, 51, 55, 51, 48, 51, 58, 55]; // C minor-ish tension
    while (nextBeat < ahead) {
      const t = nextBeat;
      const intens = intensityTarget; // 0..1
      // heartbeat on every beat
      tone(70, t, 0.16, { type: 'sine', vol: 0.34 + 0.2 * intens, slideTo: 38, bus: musicBus });
      if (beatIdx % 2 === 0) tone(60, t + 0.18, 0.14, { type: 'sine', vol: 0.18, slideTo: 36, bus: musicBus });
      // plucked arpeggio (8th notes)
      const n = arp[beatIdx % arp.length] + (beatIdx % 16 >= 8 ? 12 : 0);
      tone(N(n + 12), t, 0.28, { type: 'triangle', vol: 0.05 + 0.04 * intens, wet: 0.5, bus: musicBus });
      if (intens > 0.5) tone(N(n + 24), t + (60 / bpm) / 2, 0.15, { type: 'square', vol: 0.02, lp: 3000, wet: 0.4, bus: musicBus });
      if (drone) drone.f.frequency.setTargetAtTime(240 + 900 * intens, t, 0.3);
      bpm = 72 + 60 * intens;
      nextBeat += 60 / bpm;
      beatIdx++;
    }
  }

  function setIntensity(x) {
    intensityTarget = Math.max(0, Math.min(1, x));
  }

  function stopMusic() {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
    if (drone && ctx) {
      const d = drone;
      d.g.gain.cancelScheduledValues(now());
      d.g.gain.setTargetAtTime(0.0001, now(), 0.12);
      setTimeout(() => {
        try { d.o1.stop(); d.o2.stop(); } catch (e) { /* noop */ }
      }, 600);
    }
    drone = null;
    intensityTarget = 0;
  }

  // ---------------- optional Telugu voice (speechSynthesis) ----------------
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = window.speechSynthesis.getVoices().find((x) => /^te/i.test(x.lang));
      u.lang = v ? v.lang : 'te-IN';
      if (v) u.voice = v;
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch (e) { /* noop */ }
  }

  return {
    init,
    fx,
    startMusic,
    stopMusic,
    setIntensity,
    speak,
    setEnabled(v) {
      enabled = !!v;
      if (!enabled) stopMusic();
    },
    setSfxVolume(v) {
      sfxVol = v;
      if (sfxBus) sfxBus.gain.value = v;
    },
    setMusicVolume(v) {
      musicVol = v;
      if (musicBus) musicBus.gain.value = v;
    },
    get ready() {
      return !!ctx;
    },
  };
})();
