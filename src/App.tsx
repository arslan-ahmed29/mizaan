import { useState, useEffect } from "react";
import type { Ring, RingPair, FetchedVerse, RingSurah } from "./types";
import { SURAHS, getVerseRingLabel } from "./data/ringMaps";
import { fetchSurahVerses } from "./api/quranApi";
import RingDiagram from "./components/RingDiagram";

// ─────────────────────────────────────────────────────────────────────────────

interface SelectionPayload { ring: Ring; pair: RingPair; side: "a" | "b" }

const S = {
  // colours
  bg:        "#0d0b08",
  bg2:       "#131009",
  bg3:       "#1a1610",
  gold:      "#C8A97E",
  goldDim:   "#8a7050",
  goldFaint: "#3a2e1a",
  text:      "#e8d9c0",
  textDim:   "#a09070",
  textFaint: "#5a4a30",
  border:    "#C8A97E18",
  borderMid: "#C8A97E35",
};

// ── Pair Detail ───────────────────────────────────────────────────────────────

function PairDetail({ sel, onClose }: { sel: SelectionPayload; onClose: () => void }) {
  const { ring, pair } = sel;
  return (
    <div style={{
      background: S.bg3, border: `1px solid ${ring.color}40`,
      borderRadius: 12, padding: 24, marginTop: 16,
      position: "relative", animation: "fadeSlide 0.25s ease",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 12, right: 14,
        background: "none", border: "none", color: S.goldDim,
        cursor: "pointer", fontSize: 20, lineHeight: 1,
      }}>✕</button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: ring.color, boxShadow: `0 0 8px ${ring.color}` }} />
        <span style={{ color: ring.color, fontFamily: "serif", fontSize: 12, letterSpacing: 2.5 }}>
          RING {ring.label} · {pair.a.theme.toUpperCase()}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {([pair.a, pair.b] as const).map((side, i) => (
          <div key={i} style={{
            background: "#ffffff07", border: `1px solid ${ring.color}22`,
            borderRadius: 8, padding: 18,
          }}>
            <div style={{ color: ring.color, fontSize: 11, letterSpacing: 2, marginBottom: 12, opacity: 0.85 }}>
              {i === 0 ? ring.label : `${ring.label}′`} · VERSE {side.verse}
            </div>
            {/* Arabic */}
            <p style={{
              color: S.text, fontSize: 20, fontFamily: "serif", lineHeight: 2.2,
              direction: "rtl", textAlign: "right", margin: "0 0 14px",
            }}>
              {side.arabic}
            </p>
            {/* English */}
            <p style={{ color: S.textDim, fontSize: 13, fontFamily: "Georgia, serif", lineHeight: 1.75, margin: 0 }}>
              {side.text}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 14, padding: "10px 14px",
        background: `${ring.color}12`, borderRadius: 6, borderLeft: `3px solid ${ring.color}`,
      }}>
        <span style={{ color: S.textDim, fontSize: 12, fontFamily: "serif" }}>
          <span style={{ color: ring.color }}>Shared theme:</span>{" "}
          {pair.a.theme} — these sections mirror each other structurally and thematically, both pointing to the centre.
        </span>
      </div>
    </div>
  );
}

// ── Verse Proof ───────────────────────────────────────────────────────────────

function VerseProof({
  surah, verses, loading, selectedRingLabel, onSelectRing,
}: {
  surah: RingSurah; verses: FetchedVerse[]; loading: boolean;
  selectedRingLabel: string | null; onSelectRing: (l: string | null) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginTop: 40, border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
      {/* Section header (toggleable) */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 24px", background: S.bg2, border: "none", cursor: "pointer",
          borderBottom: open ? `1px solid ${S.border}` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 11, letterSpacing: 3, color: S.gold, opacity: 0.8 }}>VERSE MAP</span>
          <span style={{ fontSize: 11, color: S.textFaint }}>
            every ayah colour-coded by ring — proof of the mirroring structure
          </span>
        </div>
        <span style={{ color: S.goldDim, fontSize: 16 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ padding: "0 8px 12px" }}>
          {loading ? (
            <p style={{ padding: "24px", color: S.textFaint, fontFamily: "serif", fontSize: 13, margin: 0 }}>
              Loading verses…
            </p>
          ) : verses.length === 0 ? (
            <p style={{ padding: "24px", color: S.textFaint, fontFamily: "serif", fontSize: 13, margin: 0 }}>
              Verse data unavailable.
            </p>
          ) : (
            verses.map((v) => {
              const ring = getVerseRingLabel(surah, v.number);
              const baseLabel = ring?.label.replace("′", "");
              const isHighlighted = !!(ring && selectedRingLabel && selectedRingLabel === baseLabel);
              const isCentre = ring?.side === "center";

              return (
                <div
                  key={v.number}
                  onClick={() => {
                    if (!ring) return;
                    onSelectRing(selectedRingLabel === baseLabel ? null : baseLabel!);
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 26px 1fr 1fr",
                    gap: 14,
                    alignItems: "start",
                    padding: "12px 16px",
                    borderRadius: 8,
                    marginTop: 2,
                    cursor: ring ? "pointer" : "default",
                    background: isHighlighted
                      ? `${ring!.color}14`
                      : isCentre ? `${S.gold}08` : "transparent",
                    border: `1px solid ${isHighlighted ? ring!.color + "30" : "transparent"}`,
                    transition: "all 0.15s",
                  }}
                >
                  {/* Verse number */}
                  <span style={{ color: S.textFaint, fontSize: 11, fontFamily: "serif", paddingTop: 3 }}>
                    {v.number}
                  </span>

                  {/* Ring badge */}
                  <div style={{ paddingTop: 3 }}>
                    {ring ? (
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        border: `1.5px solid ${ring.color}`,
                        background: `${ring.color}18`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 7, color: ring.color, fontFamily: "serif", fontWeight: "bold",
                      }}>
                        {ring.label === "X" ? "X" : ring.side === "a" ? ring.label : `${ring.label.replace("′","")}′`}
                      </div>
                    ) : (
                      <div style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${S.goldFaint}` }} />
                    )}
                  </div>

                  {/* English translation */}
                  <p style={{
                    color: isHighlighted ? S.text : S.textDim,
                    fontSize: 13, fontFamily: "Georgia, serif", lineHeight: 1.75,
                    margin: 0,
                  }}>
                    {v.text}
                  </p>

                  {/* Arabic */}
                  <p style={{
                    color: isHighlighted && ring ? ring.color : ring ? `${ring.color}70` : S.goldFaint,
                    fontSize: 17, fontFamily: "serif", lineHeight: 2,
                    direction: "rtl", textAlign: "right", margin: 0,
                  }}>
                    {v.arabic}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ── Surah Tabs ────────────────────────────────────────────────────────────────

function SurahTabs({
  active, onChange,
}: { active: string; onChange: (k: string) => void }) {
  const [showAll, setShowAll] = useState(false);
  const mapped = Object.values(SURAHS);

  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {mapped.map((s) => (
          <button key={s.key} onClick={() => onChange(s.key)} style={{
            background: active === s.key ? `${S.gold}18` : "transparent",
            border: `1px solid ${active === s.key ? S.gold : S.borderMid}`,
            color: active === s.key ? S.gold : S.goldDim,
            borderRadius: 6, padding: "8px 16px",
            cursor: "pointer", fontFamily: "serif", fontSize: 13,
            letterSpacing: 0.5, transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ opacity: 0.5, fontSize: 11 }}>{s.number}.</span>
            {s.name}
            <span style={{ opacity: 0.45, fontSize: 13 }}>{s.arabic}</span>
          </button>
        ))}

        <button onClick={() => setShowAll(o => !o)} style={{
          background: "transparent", border: `1px dashed ${S.goldFaint}`,
          color: S.textFaint, borderRadius: 6, padding: "8px 14px",
          cursor: "pointer", fontFamily: "serif", fontSize: 12, letterSpacing: 0.5,
        }}>
          {showAll ? "− hide all surahs" : "+ view all 114 surahs"}
        </button>
      </div>

      {showAll && (
        <div style={{
          marginTop: 12, padding: "16px 20px",
          background: S.bg2, border: `1px solid ${S.border}`,
          borderRadius: 8, fontSize: 12, color: S.textFaint,
          fontFamily: "serif", lineHeight: 1.8,
        }}>
          Full scholarly ring maps are being added progressively. Currently mapped: Al-Fatiha, Al-Baqarah, Al-Ikhlas, Al-Nas.
          The next phase will add Al-Kahf, Ya-Sin, Al-Mulk, Al-Imran, Al-Rahman, and more — then AI-generated structure for the remaining surahs.
        </div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeKey, setActiveKey] = useState("fatiha");
  const [selection, setSelection] = useState<SelectionPayload | null>(null);
  const [verses, setVerses] = useState<FetchedVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  const surah = SURAHS[activeKey];
  const selectedRingLabel = selection?.ring.label ?? null;

  useEffect(() => {
    setVerses([]); setLoadingVerses(true);
    fetchSurahVerses(surah.number)
      .then(setVerses).catch(() => setVerses([]))
      .finally(() => setLoadingVerses(false));
  }, [surah.number]);

  function handleSelectPair(sel: SelectionPayload) {
    setSelection(prev => prev?.ring.label === sel.ring.label ? null : sel);
  }

  function handleSelectRingFromProof(label: string | null) {
    if (!label) { setSelection(null); return; }
    const ring = surah.rings.find(r => r.label === label);
    if (!ring) return;
    setSelection({ ring, pair: ring.pairs[0], side: "a" });
  }

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.text, fontFamily: "Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600&display=swap');
        @keyframes fadeSlide { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0b08; }
        ::-webkit-scrollbar-thumb { background: #C8A97E30; border-radius: 2px; }
        button:hover { opacity: 0.85; }
      `}</style>

      {/* ── Hero / Home header ── */}
      <div style={{
        padding: "60px 48px 48px",
        borderBottom: `1px solid ${S.border}`,
        background: `linear-gradient(180deg, #1a1508 0%, ${S.bg} 100%)`,
      }}>
        {/* Arabic word "Mizaan" in large calligraphy */}
        <p style={{
          fontSize: 42, fontFamily: "serif", color: S.gold, opacity: 0.2,
          direction: "rtl", marginBottom: 8, letterSpacing: 4,
        }}>
          ميزان
        </p>
        <h1 style={{
          fontSize: 52, fontWeight: 300, color: S.gold,
          letterSpacing: 3, marginBottom: 12, fontFamily: "Cormorant Garamond, serif",
        }}>
          Mizaan
        </h1>
        <p style={{ fontSize: 16, color: S.goldDim, letterSpacing: 5, textTransform: "uppercase", marginBottom: 24, fontFamily: "serif" }}>
          Qur'an Ring Composition Visualizer
        </p>
        <p style={{ fontSize: 14, color: S.textDim, lineHeight: 1.9, maxWidth: 580 }}>
          Scholars like{" "}
          <span style={{ color: S.gold, opacity: 0.8 }}>Raymond Farrin</span> and{" "}
          <span style={{ color: S.gold, opacity: 0.8 }}>Michel Cuypers</span> discovered that
          Quranic surahs follow a concentric mirror structure — verses at the opening reflect verses
          at the close, each ring pointing inward to a central keystone. This is that structure, made visible.
        </p>
      </div>

      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "44px 32px 80px" }}>

        <SurahTabs active={activeKey} onChange={(k) => { setActiveKey(k); setSelection(null); }} />

        {/* ── Main grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>

          {/* Left — diagram */}
          <div>
            <RingDiagram surah={surah} onSelectPair={handleSelectPair} selectedRingLabel={selectedRingLabel} />

            {/* Center card */}
            <div style={{
              marginTop: 16, padding: "14px 20px",
              background: `${S.gold}08`, border: `1px solid ${S.borderMid}`,
              borderRadius: 8, textAlign: "center",
            }}>
              <div style={{ color: S.gold, fontSize: 10, letterSpacing: 3, marginBottom: 6 }}>
                ✦ CENTER · X · VERSE {surah.center.verse}
              </div>
              <div style={{ color: S.textDim, fontSize: 13, lineHeight: 1.7 }}>
                {surah.center.label}
              </div>
            </div>
          </div>

          {/* Right — ring legend + detail */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: S.textFaint, marginBottom: 14 }}>
              RING STRUCTURE
            </div>

            {surah.rings.map((ring) => (
              <div
                key={ring.label}
                onClick={() => handleSelectRingFromProof(selectedRingLabel === ring.label ? null : ring.label)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "12px 10px", borderBottom: `1px solid #ffffff06`,
                  cursor: "pointer", borderRadius: 6,
                  background: selectedRingLabel === ring.label ? `${ring.color}10` : "transparent",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 60, paddingTop: 2 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: ring.color, flexShrink: 0 }} />
                  <span style={{ color: ring.color, fontFamily: "serif", fontSize: 14, fontWeight: "bold" }}>
                    {ring.label}↔{ring.label}′
                  </span>
                </div>
                <div>
                  <div style={{ color: S.textDim, fontSize: 13, marginBottom: 3 }}>{ring.pairs[0].a.theme}</div>
                  <div style={{ color: S.textFaint, fontSize: 11 }}>
                    v.{ring.pairs[0].a.verse} ↔ v.{ring.pairs[0].b.verse}
                  </div>
                </div>
              </div>
            ))}

            {!selection ? (
              <div style={{
                marginTop: 16, padding: "16px 18px",
                background: "#ffffff04", border: `1px solid #ffffff08`,
                borderRadius: 8,
              }}>
                <div style={{ color: S.textFaint, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>HOW TO READ</div>
                <p style={{ color: "#6a5a48", fontSize: 13, lineHeight: 1.85 }}>
                  Each lettered ring (A, B, C…) has a mirror pair (A′, B′, C′).
                  The outermost ring wraps the whole surah; everything converges on the{" "}
                  <span style={{ color: S.gold }}>X center</span> — the surah's core message.
                </p>
                <p style={{ color: `${S.gold}50`, fontSize: 12, marginTop: 12 }}>
                  ↑ Click any ring node or row to explore the verse pair
                </p>
              </div>
            ) : (
              <PairDetail sel={selection} onClose={() => setSelection(null)} />
            )}
          </div>
        </div>

        {/* ── Verse proof ── */}
        <VerseProof
          surah={surah}
          verses={verses}
          loading={loadingVerses}
          selectedRingLabel={selectedRingLabel}
          onSelectRing={handleSelectRingFromProof}
        />

        {/* ── Roadmap ── */}
        <div style={{
          marginTop: 48, padding: "28px",
          background: "#ffffff03", border: `1px solid ${S.border}`,
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: S.gold, marginBottom: 20, opacity: 0.7 }}>
            PROJECT ROADMAP
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              { phase: "Phase 1", label: "Ring Visualizer", status: "live",    desc: "4 surahs mapped. Interactive diagram, verse proof, ring pairs." },
              { phase: "Phase 2", label: "All 114 Surahs",  status: "next",    desc: "Scholarly maps for documented surahs. AI-generated structure for the rest." },
              { phase: "Phase 3", label: "AI Theme Tagging",status: "planned", desc: "Claude AI identifies shared themes across every mirror pair." },
              { phase: "Phase 4", label: "Cross-Surah Graph",status:"planned", desc: "Thematic connections mapped across the entire Quran." },
            ].map((p) => (
              <div key={p.phase} style={{
                padding: "14px 16px",
                background: p.status === "live" ? `${S.gold}0e` : "#ffffff03",
                border: `1px solid ${p.status === "live" ? S.gold + "40" : "#ffffff08"}`,
                borderRadius: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: S.textFaint, fontSize: 10, letterSpacing: 1 }}>{p.phase}</span>
                  <span style={{
                    fontSize: 9, letterSpacing: 1, padding: "2px 7px", borderRadius: 4,
                    background: p.status === "live" ? `${S.gold}30` : p.status === "next" ? `${S.gold}15` : "#ffffff07",
                    color: p.status === "live" ? S.gold : p.status === "next" ? S.goldDim : S.textFaint,
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ color: S.textDim, fontSize: 12, marginBottom: 6 }}>{p.label}</div>
                <div style={{ color: S.textFaint, fontSize: 11, lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
