import { useEffect, useState } from "react";
import type { RingPair, RingSurah } from "../types";
import { analyzeVerseTheme } from "../api/claudeApi";
import { fetchVerse } from "../api/quranApi";

interface Props {
  pair: RingPair;
  surah: RingSurah;
}

interface VerseData {
  arabic: string;
  translation: string;
}

export default function VersePanel({ pair, surah }: Props) {
  const [verseA, setVerseA] = useState<VerseData | null>(null);
  const [verseB, setVerseB] = useState<VerseData | null>(null);
  const [aiTheme, setAiTheme] = useState<string | null>(null);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [loadingTheme, setLoadingTheme] = useState(false);

  // Parse "surahId:verseNumber" from verse string like "1:2" or "2:40–103"
  function parseVerseKey(key: string): { surahId: number; verse: number } | null {
    const parts = key.split(":");
    if (parts.length < 2) return null;
    const surahId = parseInt(parts[0]);
    const verseNum = parseInt(parts[1].split("–")[0].split("-")[0]);
    if (isNaN(surahId) || isNaN(verseNum)) return null;
    return { surahId, verse: verseNum };
  }

  useEffect(() => {
    let cancelled = false;
    setVerseA(null);
    setVerseB(null);
    setAiTheme(null);

    async function load() {
      setLoadingVerses(true);
      try {
        const keyA = parseVerseKey(pair.a.verse);
        const keyB = parseVerseKey(pair.b.verse);

        const [vA, vB] = await Promise.all([
          keyA ? fetchVerse(keyA.surahId, keyA.verse) : null,
          keyB ? fetchVerse(keyB.surahId, keyB.verse) : null,
        ]);

        if (cancelled) return;
        if (vA) setVerseA({ arabic: vA.arabic, translation: vA.text });
        if (vB) setVerseB({ arabic: vB.arabic, translation: vB.text });

        // AI theme tagging
        if (vA && vB && import.meta.env.VITE_ANTHROPIC_API_KEY &&
            import.meta.env.VITE_ANTHROPIC_API_KEY !== "placeholder") {
          setLoadingTheme(true);
          try {
            const theme = await analyzeVerseTheme(vA.text, vB.text);
            if (!cancelled) setAiTheme(theme);
          } catch {
            if (!cancelled) setAiTheme(null);
          } finally {
            if (!cancelled) setLoadingTheme(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch verses", err);
      } finally {
        if (!cancelled) setLoadingVerses(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [pair, surah]);

  return (
    <div className="flex flex-col gap-5 p-5 h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gold/20 pb-3">
        <span className="text-xs text-gold/50 uppercase tracking-widest font-english">
          Ring Pair
        </span>
        <h2 className="text-gold text-xl font-english font-semibold mt-1">
          {pair.label} ↔ {pair.label}′
        </h2>
        <p className="text-gold/60 text-sm font-english mt-1 italic">{pair.theme}</p>
        {aiTheme && (
          <div className="mt-2 px-3 py-1.5 bg-gold/10 border border-gold/25 rounded text-xs text-gold font-english">
            <span className="opacity-50">AI theme: </span>{aiTheme}
          </div>
        )}
        {loadingTheme && (
          <div className="mt-2 text-xs text-gold/40 font-english animate-pulse">
            Analyzing with Claude…
          </div>
        )}
      </div>

      {loadingVerses ? (
        <div className="flex items-center justify-center flex-1">
          <span className="text-gold/40 text-sm animate-pulse font-english">Loading verses…</span>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Verse A */}
          <VerseCard
            label={pair.label}
            verseRef={pair.a.verse}
            note={pair.a.note}
            data={verseA}
            color={pair.color}
          />

          <div className="flex items-center gap-2 opacity-30">
            <div className="flex-1 h-px bg-gold/30" />
            <span className="text-gold text-xs">mirrors</span>
            <div className="flex-1 h-px bg-gold/30" />
          </div>

          {/* Verse B */}
          <VerseCard
            label={`${pair.label}′`}
            verseRef={pair.b.verse}
            note={pair.b.note}
            data={verseB}
            color={pair.color}
          />
        </div>
      )}
    </div>
  );
}

function VerseCard({
  label,
  verseRef,
  note,
  data,
  color,
}: {
  label: string;
  verseRef: string;
  note: string;
  data: VerseData | null;
  color: string;
}) {
  return (
    <div
      className="rounded-lg p-4 border border-opacity-20"
      style={{ borderColor: color, background: "rgba(13,11,8,0.6)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded font-english"
          style={{ background: color + "22", color }}
        >
          {label}
        </span>
        <span className="text-gold/40 text-xs font-english">{verseRef}</span>
      </div>
      {data ? (
        <>
          <p
            className="text-right text-xl leading-loose mb-3 font-arabic"
            style={{ color, direction: "rtl" }}
          >
            {data.arabic}
          </p>
          <p className="text-gold/75 text-sm font-english leading-relaxed italic">
            {data.translation}
          </p>
        </>
      ) : (
        <>
          <p className="text-right text-lg text-gold/40 font-arabic" dir="rtl">—</p>
          <p className="text-gold/50 text-sm font-english italic mt-2">{note}</p>
        </>
      )}
    </div>
  );
}
