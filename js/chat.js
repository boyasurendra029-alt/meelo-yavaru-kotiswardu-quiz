// chat.js — talks to /api/chat (Vercel function) and also has a Demo (fake chat) mode.
window.ChatClient = class ChatClient {
  constructor(opts) {
    this.video = opts.video;
    this.apiKey = opts.apiKey || '';
    this.onMessages = opts.onMessages;
    this.onStatus = opts.onStatus || function () {};
    this.state = null;
    this.running = false;
    this.seen = new Set();
    this.errors = 0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.onStatus({ level: 'connecting', text: 'Chat కి connect అవుతోంది…' });
    this.loop();
  }

  stop() {
    this.running = false;
  }

  async loop() {
    while (this.running) {
      let wait = 2000;
      try {
        const r = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ video: this.video, apiKey: this.apiKey, state: this.state }),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        if (!this.running) return;
        if (j.ok) {
          this.state = j.state;
          wait = j.wait || 2000;
          this.errors = 0;
          const fresh = [];
          for (const m of j.messages || []) {
            if (!m.id || this.seen.has(m.id)) continue;
            this.seen.add(m.id);
            if (!j.initial) fresh.push(m);
          }
          if (this.seen.size > 6000) this.seen = new Set(Array.from(this.seen).slice(-3000));
          this.onStatus({ level: 'ok', text: 'Chat connected ✔' });
          if (fresh.length) this.onMessages(fresh);
        } else if (j.reinit) {
          this.state = null;
          wait = 800;
        } else {
          this.errors++;
          wait = Math.min(12000, 3000 + this.errors * 1500);
          this.onStatus({ level: 'error', text: j.message || 'Chat error' });
        }
      } catch (e) {
        this.errors++;
        wait = Math.min(12000, 3000 + this.errors * 1500);
        this.onStatus({
          level: 'error',
          text: 'Server కి connect కాలేదు. Vercel లో deploy చేసిన link లో తెరవండి (లేదా Demo mode try చేయండి).',
        });
      }
      await new Promise((res) => setTimeout(res, wait));
    }
  }
};

// ---------- Demo chat (for testing / practising without a live stream) ----------
window.DemoChat = class DemoChat {
  constructor(opts) {
    this.onMessages = opts.onMessages;
    this.hint = opts.hint || function () { return null; }; // returns the correct letter or null
    this.onStatus = opts.onStatus || function () {};
    this.timer = null;
    this.n = 0;
    const names = [
      'Ravi Teja', 'Sai Kiran', 'Lakshmi', 'Venkatesh', 'Priya', 'Anil Kumar', 'Sravani', 'Mahesh', 'Divya', 'Nagaraju',
      'Harika', 'Pavan', 'Swathi', 'Kiran', 'Bhargavi', 'Srinu', 'Madhavi', 'Raju', 'Anusha', 'Chaitanya',
      'Teja', 'Vamsi', 'Keerthi', 'Naveen', 'Sirisha', 'Rakesh', 'Jyothi', 'Prasad', 'Manasa', 'Subbu',
      'Ramya', 'Charan', 'Deepika', 'Gopi', 'Haritha', 'Murali', 'Pooja', 'Satish', 'Tulasi', 'Uday',
    ];
    // 40 base names x 3 = 120 demo viewers
    this.users = [];
    for (let r = 0; r < 3; r++) names.forEach((nm, i) => this.users.push({ uid: 'demo' + r + '-' + i, name: r ? nm + ' ' + (r + 1) : nm, photo: '' }));
  }

  start() {
    this.onStatus({ level: 'ok', text: 'DEMO mode (fake chat)' });
    this.timer = setInterval(() => {
      const burst = 2 + Math.floor(Math.random() * 4);
      const msgs = [];
      for (let i = 0; i < burst; i++) {
        const u = this.users[Math.floor(Math.random() * this.users.length)];
        const right = this.hint();
        let letter;
        if (right && Math.random() < 0.55) letter = right;
        else letter = 'ABCD'[Math.floor(Math.random() * 4)];
        const styles = [letter, letter.toLowerCase(), letter + ')', 'ans ' + letter, String('ABCD'.indexOf(letter) + 1)];
        const text = Math.random() < 0.15 ? 'hello anna 👋' : styles[Math.floor(Math.random() * styles.length)];
        msgs.push({ id: 'demo-' + ++this.n, uid: u.uid, name: u.name, photo: u.photo, text, ts: Date.now() });
      }
      this.onMessages(msgs);
    }, 450);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
