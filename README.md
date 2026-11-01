# 🎙️ Live కోటీశ్వర Quiz — YouTube Shorts Live (9:16)

Telugu KBC-style quiz. Viewers **chat లో A / B / C / D** అని type చేస్తారు → 30 sec తర్వాత answer reveal → correct చెప్పినవారి logo + username → వాళ్లు గెలిచిన ₹ → **Top 10 earners**. Side లో ఎప్పుడూ **Top 3**. ప్రతి live = **50 questions**, prize ₹1,000 → **₹10 Cr** (Q10 = ₹10K, Q20 = ₹1 L, Q30 = ₹10 L, Q40 = ₹1 Cr, Q50 = ₹10 Cr). ఒక్కో question కి **59 sec**. ఒక live లో గానీ, తర్వాతి lives లో గానీ question repeat అవ్వదు (450+ question bank).

> ₹ amounts అన్నీ **game points** మాత్రమే (నిజమైన డబ్బు కాదు). Screen మీద చిన్నగా ఆ note కూడా ఉంటుంది.

---

## 1. ఒక్కసారి Setup (GitHub + Vercel)

1. **GitHub** లో కొత్త repository చేయండి (ఉదా: `telugu-quiz-live`).
2. ఈ folder లో ఉన్న **అన్ని files** (`index.html`, `api/`, `js/`, `css/`, `fonts/`, `package.json`) ఆ repo కి upload చేయండి
   (GitHub → *Add file → Upload files* → folder structure అలాగే ఉండాలి).
3. **Vercel** (vercel.com) → *Add New → Project* → ఆ GitHub repo ని *Import* → **Deploy** నొక్కండి.
   - Framework: *Other* — ఇంకేమీ మార్చొద్దు. Build command అవసరం లేదు.
4. Deploy అయ్యాక వచ్చే link (`https://xxxx.vercel.app`) ని friends కి share చేయండి. 🎉

Chat reading కోసం **API key అవసరం లేదు** (మీ పాత project లో లాగే YouTube public chat ని `/api/chat` function చదువుతుంది).

*(Optional)* official API fallback కావాలంటే Vercel → Project → Settings → Environment Variables → `YT_API_KEY` add చేయండి.

## 2. ప్రతి live కి (మీరు & friends)

1. YouTube లో **Live** మొదలుపెట్టండి (Shorts / vertical). **Chat ON** లో ఉండాలి.
2. Game link తెరవండి → **YouTube Live link** paste చేయండి → **▶ START LIVE GAME**.
   (API key box *More options* లో ఉంది — సాధారణంగా ఖాళీగా వదిలేయండి.)
3. Stream కి ఆ browser **tab/window ని share చేయండి (audio తో)**. Game 9:16 లో window మధ్యలో auto-fit అవుతుంది.
   - Phone portrait లో full screen. PC లో window ని tall గా చేయండి లేదా OBS లో 1080×1920 *Window/Browser capture*.
4. Practice కోసం **🧪 Demo mode** — fake chat తో మొత్తం game చూడొచ్చు.

## 3. Host controls (stream లో కనిపించవు, mouse కదిలిస్తే ⚙ వస్తుంది)

| Key | పని |
|---|---|
| `H` | Host panel show/hide |
| `Space` | Pause / Resume (sound కూడా mute) |
| `N` | ఆ step skip |
| `G` | **Safe-area guide** (YouTube UI ఎక్కడ కప్పుతుందో చూపిస్తుంది) |

Panel లో: **🎉 End show + Top 10** (ధన్యవాదాలు + fireworks + Top 10 celebration), Restart Q1, Reset leaderboard, volume sliders.

## 4. Game ఎలా నడుస్తుంది

ప్రతి question: **prize పెరిగే animation (₹ count-up) → question + 4 options → 59 sec timer → Lock → Reveal → సరిగ్గా చెప్పిన *అందరి* logo + name (auto-scroll) → ప్రైజ్ మనీ panel → Top 10**.
50 questions అయ్యాక **ధన్యవాదాలు + Top 10 celebration** (fireworks, confetti) screen మీద ఉంటుంది. కొత్త live కి host panel లో **🆕 New show** (లేదా page refresh → Start).
Side లో ఎప్పుడూ Top 3 + ప్రశ్న progress + ఆడుతున్నవారి సంఖ్య (prize list లేదు).

- ఒక్కొక్కరి **మొదటి answer మాత్రమే** count (మార్చడం కుదరదు). Accepted: `A`, `b`, `C)`, `ans d`, `1`–`4`.
- Leaderboard browser లో save అవుతుంది (refresh చేసినా ఉంటుంది).
- Timer (default 59 sec), show పేరు *More options* లో మార్చొచ్చు. కొత్త live = కొత్త leaderboard (పాతది కొనసాగించాలంటే ఆ tick box).
- Question repeat కాకుండా game గుర్తుపెట్టుకుంటుంది (ఈ browser లో). Bank అయిపోతేనే ఆ difficulty level reset అవుతుంది.

## 5. మీ own questions

*More options → Own questions* లో JSON paste చేయండి. **మొదటి option ఎప్పుడూ సరైన answer** (game A/B/C/D ని random గా shuffle చేస్తుంది):

```json
[
  {"level": 3, "q": "మన రాష్ట్ర పక్షి ఏది?", "o": ["పాలపిట్ట", "నెమలి", "చిలుక", "కోకిల"]},
  {"q": "level లేకుండా రాస్తే ఏ level లో అయినా వస్తుంది", "o": ["సరైనది", "తప్పు 1", "తప్పు 2", "తప్పు 3"]}
]
```
`level` = question number 1 … 50 (ఆ difficulty tier లో వస్తుంది). ఎక్కువ questions శాశ్వతంగా add చేయాలంటే `js/questions.js` edit చేయండి.

## 6. Troubleshooting

- **"Live chat దొరకలేదు"** → Live నిజంగా మొదలైందా? Chat off లో ఉందా? Link సరైనదా? చూడండి. Game ఆటోగా retry చేస్తూ ఉంటుంది.
- **"Server కి connect కాలేదు"** → `index.html` ని double-click తో కాకుండా **Vercel link** లో తెరవండి.
- **Sound రావడం లేదు** → Start బటన్ నొక్కిన తర్వాతే sound వస్తుంది; stream share లో *tab audio* tick చేయండి.
- Browser tab ని background లో ఉంచకండి (timers slow అవుతాయి).

## Folder

```
index.html   css/style.css   js/{game,audio,chat,questions,questions-extra,bank-more}.js
api/chat.js  (Vercel serverless — YouTube live chat reader)
fonts/       (Telugu font, offline)
```
