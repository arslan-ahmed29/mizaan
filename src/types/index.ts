export interface VerseSide {
  verse: number | string;
  text: string;
  arabic: string;
  theme: string;
}

export interface RingPair {
  a: VerseSide;
  b: VerseSide;
}

export interface Ring {
  level: number;
  label: string;
  color: string;
  pairs: RingPair[];
}

export interface RingSurah {
  key: string;
  name: string;
  arabic: string;
  number: number;
  totalVerses: number;
  center: { verse: number | string; label: string };
  rings: Ring[];
}

// For live verse fetching
export interface FetchedVerse {
  number: number;
  arabic: string;
  text: string;
}

export interface SurahMeta {
  id: number;
  name: string;
  arabic: string;
  totalVerses: number;
}
