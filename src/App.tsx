import { useEffect, useState, useCallback } from "react";
import type { SurahMeta, RingPair, RingSurah } from "./types";
import { fetchSurahList } from "./api/quranApi";
import { getRingMap } from "./data/ringMaps";
import SurahSelector from "./components/SurahSelector";
import RingDiagram from "./components/RingDiagram";
import VersePanel from "./components/VersePanel";

export default function App() {
  const [surahList, setSurahList] = useState<SurahMeta[]>([]);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [ringMap, setRingMap] = useState<RingSurah | null>(null);
  const [selectedPair, setSelectedPair] = useState<RingPair | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all 114 surahs on mount
  useEffect(() => {
    fetchSurahList()
      .then(setSurahList)
      .catch(() => setError("Failed to load Surah list"))
      .finally(() => setLoadingList(false));
  }, []);

  // Load ring map when selection changes
  useEffect(() => {
    setSelectedPair(null);
    const map = getRingMap(selectedId);
    setRingMap(map);
  }, [selectedId]);

  const handleSelectSurah = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleSelectPair = useCallback((pair: RingPair) => {
    setSelectedPair((prev) => (prev?.label === pair.label ? null : pair));
  }, []);

  return (
    <div className="flex h-screen bg-bg-dark text-gold overflow-hidden">
      {/* Left sidebar – Surah selector */}
      <aside className="w-56 shrink-0 border-r border-gold/10 bg-bg-panel flex flex-col overflow-hidden">
        {loadingList ? (
          <div className="flex items-center justify-center flex-1">
            <span className="text-gold/30 text-sm animate-pulse font-english">Loading…</span>
          </div>
        ) : error ? (
          <div className="p-4 text-red-400 text-sm font-english">{error}</div>
        ) : (
          <SurahSelector
            surahList={surahList}
            selectedId={selectedId}
            onSelect={handleSelectSurah}
          />
        )}
      </aside>

      {/* Center – Ring diagram */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
        {ringMap ? (
          <>
            <RingDiagram
              surah={ringMap}
              onSelectPair={handleSelectPair}
              selectedPair={selectedPair}
            />
            <p className="absolute bottom-5 text-gold/25 text-xs font-english tracking-widest uppercase">
              Click a ring node to explore verse pairs
            </p>
          </>
        ) : (
          <NoRingMap surahId={selectedId} surahList={surahList} />
        )}
      </main>

      {/* Right panel – Verse / theme detail */}
      <aside
        className={`shrink-0 border-l border-gold/10 bg-bg-panel transition-all duration-300 overflow-hidden ${
          selectedPair ? "w-80" : "w-0"
        }`}
      >
        {selectedPair && ringMap && (
          <VersePanel pair={selectedPair} surah={ringMap} />
        )}
      </aside>
    </div>
  );
}

function NoRingMap({
  surahId,
  surahList,
}: {
  surahId: number;
  surahList: SurahMeta[];
}) {
  const meta = surahList.find((s) => s.id === surahId);
  return (
    <div className="text-center space-y-3">
      <p className="text-4xl font-arabic text-gold/30" dir="rtl">
        {meta?.arabic ?? ""}
      </p>
      <p className="text-gold/40 font-english text-sm">
        No ring composition map for {meta?.name ?? `Surah ${surahId}`} yet.
      </p>
      <p className="text-gold/20 font-english text-xs">
        Select Al-Fatiha, Al-Baqarah, Al-Ikhlas, or Al-Nas
      </p>
    </div>
  );
}
