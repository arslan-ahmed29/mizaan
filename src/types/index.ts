export interface Verse {
  number: number;
  text: string;    // English translation
  arabic: string;
}

export interface RingPair {
  label: string;   // e.g. "A"
  color: string;   // hex color for this ring tier
  theme: string;   // scholarly theme
  a: { verse: string; note: string };
  b: { verse: string; note: string };
}

export interface RingSurah {
  id: number;
  name: string;
  arabic: string;
  center: { verse: string; label: string };
  rings: RingPair[];
}

export interface SurahMeta {
  id: number;
  name: string;
  arabic: string;
  totalVerses: number;
}
