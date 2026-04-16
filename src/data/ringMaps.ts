import type { RingSurah } from "../types";

export const SURAHS: Record<string, RingSurah> = {

  fatiha: {
    key: "fatiha",
    name: "Al-Fatiha",
    arabic: "الفاتحة",
    number: 1,
    totalVerses: 7,
    center: {
      verse: 4,
      label: "You alone we worship, You alone we ask for help",
    },
    rings: [
      {
        level: 1,
        label: "A",
        color: "#C8A97E",
        pairs: [
          {
            a: {
              verse: 1,
              arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
              text: "In the name of Allah, the Most Gracious, the Most Merciful",
              theme: "Divine Names & Mercy",
            },
            b: {
              verse: 7,
              arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
              text: "The path of those You have blessed — not of those who earned anger, nor of those who went astray",
              theme: "Divine Names & Mercy",
            },
          },
        ],
      },
      {
        level: 2,
        label: "B",
        color: "#B8955A",
        pairs: [
          {
            a: {
              verse: 2,
              arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
              text: "All praise is for Allah, Lord of all worlds",
              theme: "Allah's Lordship",
            },
            b: {
              verse: 6,
              arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
              text: "Guide us to the straight path",
              theme: "Allah's Lordship",
            },
          },
        ],
      },
      {
        level: 3,
        label: "C",
        color: "#A07840",
        pairs: [
          {
            a: {
              verse: 3,
              arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
              text: "The Most Gracious, the Most Merciful",
              theme: "Mercy of Allah",
            },
            b: {
              verse: 5,
              arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
              text: "You alone we worship, You alone we ask for help",
              theme: "Mercy of Allah",
            },
          },
        ],
      },
    ],
  },

  baqarah: {
    key: "baqarah",
    name: "Al-Baqarah",
    arabic: "البقرة",
    number: 2,
    totalVerses: 286,
    center: {
      verse: "142–152",
      label: "The Qibla — Direction of Worship",
    },
    rings: [
      {
        level: 1,
        label: "A",
        color: "#C8A97E",
        pairs: [
          {
            a: {
              verse: "1–20",
              arabic: "الم ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ",
              text: "Faith vs. Disbelief — the three groups: believers, disbelievers, hypocrites",
              theme: "Faith & Disbelief",
            },
            b: {
              verse: "261–286",
              arabic: "مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ",
              text: "Spending in Allah's way — true faith expressed through action and charity",
              theme: "Faith & Disbelief",
            },
          },
        ],
      },
      {
        level: 2,
        label: "B",
        color: "#B8955A",
        pairs: [
          {
            a: {
              verse: "21–39",
              arabic: "يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ",
              text: "Allah's power in creation — the first humans, the covenant with Adam",
              theme: "Creation & Divine Power",
            },
            b: {
              verse: "254–260",
              arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
              text: "Āyat al-Kursī — Allah's absolute dominion; His Kursi extends over the heavens and earth",
              theme: "Creation & Divine Power",
            },
          },
        ],
      },
      {
        level: 3,
        label: "C",
        color: "#A07840",
        pairs: [
          {
            a: {
              verse: "40–103",
              arabic: "يَا بَنِي إِسْرَائِيلَ اذْكُرُوا نِعْمَتِيَ الَّتِي أَنْعَمْتُ عَلَيْكُمْ",
              text: "Story of Banī Isrāʾīl — their covenant, trials, and repeated breaking of promises",
              theme: "Covenant & Community",
            },
            b: {
              verse: "178–253",
              arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الْقِصَاصُ",
              text: "Laws for the Muslim community — building a covenant society (Qisas, fasting, Hajj, Jihad)",
              theme: "Covenant & Community",
            },
          },
        ],
      },
      {
        level: 4,
        label: "D",
        color: "#D4AA70",
        pairs: [
          {
            a: {
              verse: "104–141",
              arabic: "مَا كَانَ إِبْرَاهِيمُ يَهُودِيًّا وَلَا نَصْرَانِيًّا",
              text: "Ibrahim and the Kaʿbah — the original Qibla, the father of monotheism",
              theme: "Ibrahim & Sacred Direction",
            },
            b: {
              verse: "153–177",
              arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ",
              text: "Return to Ibrahim — Hajj, sacrifice, and the straight path re-established",
              theme: "Ibrahim & Sacred Direction",
            },
          },
        ],
      },
    ],
  },

  ikhlas: {
    key: "ikhlas",
    name: "Al-Ikhlas",
    arabic: "الإخلاص",
    number: 112,
    totalVerses: 4,
    center: {
      verse: 2,
      label: "Allah is the Eternal Refuge — Al-Samad",
    },
    rings: [
      {
        level: 1,
        label: "A",
        color: "#C8A97E",
        pairs: [
          {
            a: {
              verse: 1,
              arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
              text: "Say: He is Allah, the One",
              theme: "Absolute Oneness",
            },
            b: {
              verse: 4,
              arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
              text: "And there is none comparable to Him",
              theme: "Absolute Oneness",
            },
          },
        ],
      },
      {
        level: 2,
        label: "B",
        color: "#B8955A",
        pairs: [
          {
            a: {
              verse: 2,
              arabic: "اللَّهُ الصَّمَدُ",
              text: "Allah is the Eternal Refuge (Al-Samad) — all depend on Him",
              theme: "Eternal & Self-Sufficient",
            },
            b: {
              verse: 3,
              arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
              text: "He neither begets nor was begotten",
              theme: "Eternal & Self-Sufficient",
            },
          },
        ],
      },
    ],
  },

  nas: {
    key: "nas",
    name: "Al-Nas",
    arabic: "الناس",
    number: 114,
    totalVerses: 6,
    center: {
      verse: "3–4",
      label: "God of mankind — seeking refuge in Allah alone",
    },
    rings: [
      {
        level: 1,
        label: "A",
        color: "#C8A97E",
        pairs: [
          {
            a: {
              verse: 1,
              arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
              text: "Say: I seek refuge with the Lord of mankind",
              theme: "Lord of Mankind",
            },
            b: {
              verse: 6,
              arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
              text: "From among the jinn and mankind",
              theme: "Lord of Mankind",
            },
          },
        ],
      },
      {
        level: 2,
        label: "B",
        color: "#B8955A",
        pairs: [
          {
            a: {
              verse: 2,
              arabic: "مَلِكِ النَّاسِ",
              text: "The King of mankind",
              theme: "Sovereignty & Protection",
            },
            b: {
              verse: 5,
              arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
              text: "Who whispers in the hearts of mankind",
              theme: "Sovereignty & Protection",
            },
          },
        ],
      },
    ],
  },
};

export function getRingMap(key: string): RingSurah | undefined {
  return SURAHS[key];
}

// Returns which ring label owns a given verse number (for proof section)
export function getVerseRingLabel(
  surah: RingSurah,
  verseNum: number
): { label: string; color: string; side: "a" | "b" | "center" } | null {
  if (verseNum === Number(surah.center.verse)) {
    return { label: "X", color: "#C8A97E", side: "center" };
  }
  for (const ring of surah.rings) {
    for (const pair of ring.pairs) {
      const av = Number(pair.a.verse);
      const bv = Number(pair.b.verse);
      if (av === verseNum) return { label: ring.label, color: ring.color, side: "a" };
      if (bv === verseNum) return { label: `${ring.label}′`, color: ring.color, side: "b" };
    }
  }
  return null;
}
