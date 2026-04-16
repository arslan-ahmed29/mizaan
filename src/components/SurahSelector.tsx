import type { SurahMeta } from "../types";
import { getMappedSurahIds } from "../data/ringMaps";

interface Props {
  surahList: SurahMeta[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const MAPPED_IDS = new Set(getMappedSurahIds());

export default function SurahSelector({ surahList, selectedId, onSelect }: Props) {
  const mapped = surahList.filter((s) => MAPPED_IDS.has(s.id));
  const others = surahList.filter((s) => !MAPPED_IDS.has(s.id));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 border-b border-gold/15">
        <h1 className="text-gold text-lg font-english font-semibold tracking-wide">
          Mizaan
        </h1>
        <p className="text-gold/40 text-xs font-english mt-0.5">
          Qur'an Ring Composition Visualizer
        </p>
      </div>

      <div className="overflow-y-auto flex-1 py-2">
        {/* Mapped surahs (have ring diagrams) */}
        <div className="px-3 py-2">
          <span className="text-gold/40 text-xs uppercase tracking-widest font-english">
            Ring Maps Available
          </span>
        </div>
        {mapped.map((s) => (
          <SurahItem
            key={s.id}
            surah={s}
            isSelected={selectedId === s.id}
            hasMapped={true}
            onSelect={onSelect}
          />
        ))}

        {/* Other surahs */}
        <div className="px-3 py-2 mt-3">
          <span className="text-gold/40 text-xs uppercase tracking-widest font-english">
            All Surahs
          </span>
        </div>
        {others.map((s) => (
          <SurahItem
            key={s.id}
            surah={s}
            isSelected={selectedId === s.id}
            hasMapped={false}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function SurahItem({
  surah,
  isSelected,
  hasMapped,
  onSelect,
}: {
  surah: SurahMeta;
  isSelected: boolean;
  hasMapped: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <button
      onClick={() => onSelect(surah.id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
        isSelected
          ? "bg-gold/15 border-l-2 border-gold"
          : "border-l-2 border-transparent hover:bg-gold/5"
      }`}
      disabled={!hasMapped && isSelected}
    >
      <span
        className={`text-xs w-6 text-right shrink-0 font-english ${
          isSelected ? "text-gold" : "text-gold/30"
        }`}
      >
        {surah.id}
      </span>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-english truncate ${
            isSelected ? "text-gold" : hasMapped ? "text-gold/80" : "text-gold/40"
          }`}
        >
          {surah.name}
        </div>
        <div
          className={`text-xs font-arabic ${
            isSelected ? "text-gold/70" : "text-gold/25"
          }`}
          dir="rtl"
        >
          {surah.arabic}
        </div>
      </div>
      {hasMapped && (
        <span className="text-gold/50 text-xs shrink-0">◎</span>
      )}
    </button>
  );
}
