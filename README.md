# Mizaan — ميزان
### Quran Ring Composition Visualizer

Mizaan (Arabic: *the scale*) is a web app that reveals the hidden architectural beauty inside the Quran — a literary structure called **ring composition**, where verses mirror each other symmetrically around a central keystone, like rings inside rings.

---

## What is Ring Composition?

Scholars like **Raymond Farrin** (*Structure and Qur'anic Interpretation*, 2014) and **Michel Cuypers** (*The Composition of the Qur'an*, 2012) discovered that many surahs follow a precise concentric pattern:

```
A  — opening theme
  B  — second theme
    C  — third theme
      X  ← keystone (the central message)
    C' — mirrors C
  B' — mirrors B
A' — mirrors A
```

For example, **Al-Fatiha** (The Opening) — just 7 verses — forms a perfect ring around verse 4 (*"Master of the Day of Judgment"*). The first and last verses mirror each other, the second and sixth mirror each other, and so on.

---

## What Mizaan Does

- **Visualizes** the ring structure of Quran surahs as interactive concentric circle diagrams
- **Fetches** real Arabic text and English translations live from the Quran.com API
- **Shows** mirrored verse pairs side by side when you click a ring
- **Uses Claude AI** to identify the shared theological theme between each mirrored pair

---

## Surahs with Ring Maps

| Surah | Scholar | Rings |
|---|---|---|
| Al-Fatiha (1) | Raymond Farrin | 3 rings |
| Al-Baqarah (2) | Raymond Farrin | 4 rings |
| Al-Ikhlas (112) | Michel Cuypers | 2 rings |
| Al-Nas (114) | Michel Cuypers | 2 rings |
| *(more being added)* | | |

---

## Getting Started

**1. Install dependencies**
```bash
npm install
```

**2. Add your Anthropic API key** (for AI theme tagging)

Create a `.env` file in the project root:
```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```
Get your key at [console.anthropic.com](https://console.anthropic.com). Without it, the app still works — AI theme tagging is just disabled.

**3. Run the app**
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## How to Use It

1. Pick a surah from the **left sidebar** (ones with ◎ have ring maps)
2. The **center diagram** shows the concentric ring structure
3. Click any **ring node** to open the verse pair panel on the right
4. If your API key is set, Claude will label the shared theme of that ring pair

---

## Stack

- **React + TypeScript** — app framework
- **D3.js** — ring diagram visualization
- **Tailwind CSS** — styling
- **Quran.com API v4** — live Quran text and translations
- **Anthropic Claude API** — AI theme analysis

---

## Scholarly Sources

- Raymond Farrin, *Structure and Qur'anic Interpretation* (2014)
- Michel Cuypers, *The Composition of the Qur'an* (2012)
- Neal Robinson, *Discovering the Qur'an* (1996)
