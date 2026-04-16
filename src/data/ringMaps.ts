import type { RingSurah } from "../types";

// Ring colors per tier (outermost → innermost before center)
const RING_COLORS = [
  "#7B4F2E", // tier 1 outermost – warm brown
  "#A0673A", // tier 2
  "#C8A97E", // tier 3 – gold
  "#E8CFAB", // tier 4 – light gold
];

export const RING_MAPS: Record<number, RingSurah> = {

  // ── Al-Fatiha (1) ─────────────────────────────────────────────────────────
  1: {
    id: 1,
    name: "Al-Fatiha",
    arabic: "الفاتحة",
    center: {
      verse: "1:4",
      label: "X",
    },
    rings: [
      {
        label: "A",
        color: RING_COLORS[0],
        theme: "Divine Names and Mercy",
        a: { verse: "1:1", note: "In the name of Allah, the Most Gracious, the Most Merciful" },
        b: { verse: "1:7", note: "Not of those who go astray" },
      },
      {
        label: "B",
        color: RING_COLORS[1],
        theme: "Allah's Lordship and Guidance",
        a: { verse: "1:2", note: "Praise be to Allah, Lord of the Worlds" },
        b: { verse: "1:6", note: "Guide us to the straight path" },
      },
      {
        label: "C",
        color: RING_COLORS[2],
        theme: "Mercy and Judgment",
        a: { verse: "1:3", note: "The Most Gracious, the Most Merciful" },
        b: { verse: "1:5", note: "You alone we worship, You alone we ask for help" },
      },
    ],
  },

  // ── Al-Baqarah (2) ────────────────────────────────────────────────────────
  2: {
    id: 2,
    name: "Al-Baqarah",
    arabic: "البقرة",
    center: {
      verse: "2:142–152",
      label: "X",
    },
    rings: [
      {
        label: "A",
        color: RING_COLORS[0],
        theme: "Faith vs Disbelief / Spending in Allah's Way",
        a: { verse: "2:1–20", note: "Introduction: believers, disbelievers, hypocrites" },
        b: { verse: "2:261–286", note: "Charity, usury, and closing prayer of believers" },
      },
      {
        label: "B",
        color: RING_COLORS[1],
        theme: "Creation and Divine Dominion",
        a: { verse: "2:21–39", note: "Creation of Adam, temptation, expulsion from Eden" },
        b: { verse: "2:254–260", note: "Āyat al-Kursī – Allah's throne and dominion" },
      },
      {
        label: "C",
        color: RING_COLORS[2],
        theme: "Children of Israel / Laws for Muslim Community",
        a: { verse: "2:40–103", note: "Banī Isrā'īl – covenant, violations, golden calf" },
        b: { verse: "2:178–253", note: "Qisas, fasting, pilgrimage, jihad legislation" },
      },
      {
        label: "D",
        color: RING_COLORS[3],
        theme: "Ibrahim and the Ka'bah",
        a: { verse: "2:104–141", note: "Ibrahim as true faith model; rebuke of Jewish/Christian claims" },
        b: { verse: "2:153–177", note: "Return to Ibrahim; Hajj, patience, and righteousness" },
      },
    ],
  },

  // ── Al-Ikhlas (112) ───────────────────────────────────────────────────────
  112: {
    id: 112,
    name: "Al-Ikhlas",
    arabic: "الإخلاص",
    center: {
      verse: "112:1–2",
      label: "X",
    },
    rings: [
      {
        label: "A",
        color: RING_COLORS[0],
        theme: "Allah is One / None is Equal to Him",
        a: { verse: "112:1", note: "Say: He is Allah, the One" },
        b: { verse: "112:4", note: "There is none comparable to Him" },
      },
      {
        label: "B",
        color: RING_COLORS[1],
        theme: "Eternal / Beyond Birth and Generation",
        a: { verse: "112:2", note: "Allah is the Eternal Refuge (Al-Samad)" },
        b: { verse: "112:3", note: "He neither begets nor was begotten" },
      },
    ],
  },

  // ── Al-Nas (114) ──────────────────────────────────────────────────────────
  114: {
    id: 114,
    name: "Al-Nas",
    arabic: "الناس",
    center: {
      verse: "114:3–4",
      label: "X",
    },
    rings: [
      {
        label: "A",
        color: RING_COLORS[0],
        theme: "Lord of Mankind / Protection from Jinn and Men",
        a: { verse: "114:1", note: "Say: I seek refuge with the Lord of mankind" },
        b: { verse: "114:6", note: "From among jinn and mankind" },
      },
      {
        label: "B",
        color: RING_COLORS[1],
        theme: "King of Mankind / Whispers in the Hearts",
        a: { verse: "114:2", note: "The King of mankind" },
        b: { verse: "114:5", note: "Who whispers in the hearts of mankind" },
      },
    ],
  },
};

export function getRingMap(surahId: number): RingSurah | null {
  return RING_MAPS[surahId] ?? null;
}

export function getMappedSurahIds(): number[] {
  return Object.keys(RING_MAPS).map(Number);
}
