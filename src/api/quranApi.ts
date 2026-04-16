import axios from "axios";
import type { SurahMeta, Verse } from "../types";

const BASE = "https://api.quran.com/api/v4";
const TRANSLATION_ID = 131; // Sahih International

const http = axios.create({ baseURL: BASE, timeout: 15_000 });

interface ChapterItem {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
}

export async function fetchSurahList(): Promise<SurahMeta[]> {
  const { data } = await http.get<{ chapters: ChapterItem[] }>("/chapters");
  return data.chapters.map((c) => ({
    id: c.id,
    name: c.name_simple,
    arabic: c.name_arabic,
    totalVerses: c.verses_count,
  }));
}

interface VerseItem {
  verse_number: number;
  text_uthmani: string;
  translations: Array<{ text: string }>;
}

interface VersesResponse {
  verses: VerseItem[];
  pagination: { next_page: number | null };
}

export async function fetchSurahVerses(surahId: number): Promise<Verse[]> {
  const all: Verse[] = [];
  let page = 1;

  while (true) {
    const { data } = await http.get<VersesResponse>(
      `/verses/by_chapter/${surahId}`,
      {
        params: {
          language: "en",
          translations: TRANSLATION_ID,
          fields: "text_uthmani",
          per_page: 50,
          page,
        },
      }
    );

    for (const v of data.verses) {
      all.push({
        number: v.verse_number,
        arabic: v.text_uthmani,
        text: v.translations?.[0]?.text ?? "",
      });
    }

    if (data.pagination.next_page === null) break;
    page = data.pagination.next_page;
  }

  return all;
}

export async function fetchVerse(
  surahId: number,
  verseNumber: number
): Promise<Verse> {
  const { data } = await http.get<{ verse: VerseItem }>(
    `/verses/by_key/${surahId}:${verseNumber}`,
    {
      params: { language: "en", translations: TRANSLATION_ID, fields: "text_uthmani" },
    }
  );
  const v = data.verse;
  return {
    number: v.verse_number,
    arabic: v.text_uthmani,
    text: v.translations?.[0]?.text ?? "",
  };
}
