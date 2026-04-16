import { useState, useEffect } from "react";
import type { Ring, RingPair, FetchedVerse, RingSurah } from "./types";
import { SURAHS, getVerseRingLabel } from "./data/ringMaps";
import { fetchSurahVerses } from "./api/quranApi";
import RingDiagram from "./components/RingDiagram";

// ── Types ────────────────────────────────────────────────────────────────────

interface SelectionPayload {
  ring: Ring;
  pair: RingPair;
  side: "a" | "b";
}

// ── Pair Detail Panel ────────────────────────────────────────────────────────

function PairDetail({
  selection,
  onClose,
}: {
  selection: SelectionPayload | null;
  onClose: () => void;
}) {
  if (!selection) return null;
  const { ring, pair } = selection;
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1410 0%, #120f0a 100%)",
        border: `1px solid ${ring.color}40`,
        borderRadius: 12,
        padding: "24px",
        marginTop: 16,
        position: "relative",
        animation: "fadeSlide 0.3s ease",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 12, right: 14,
          background: "none", border: "none", color: "#C8A97E",
          cursor: "pointer", fontSize: 18, opacity: 0.6,
        }}
      >✕</button>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: ring.color, boxShadow: `0 0 8px ${ring.color}`,
        }} />
        <span style={{ color: ring.color, fontFamily: "serif", fontSize: 13, letterSpacing: 2 }}>
          RING {ring.label} — {pair.a.theme}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[pair.a, pair.b].map((side, i) => (
          <div key={i} style={{
            background: "#ffffff08",
            border: `1px solid ${ring.color}25`,
            borderRadius: 8, padding: 16,
          }}>
            <div style={{
              color: ring.color, fontFamily: "serif", fontSize: 11,
              letterSpacing: 2, marginBottom: 8, opacity: 0.8,
            }}>
              {i === 0 ? ring.label : `${ring.label}′`} · VERSE {side.verse}
            </div>
            <div style={{
              color: "#e8d9c0", fontSize: 18, fontFamily: "serif",
              lineHeight: 2, marginBottom: 12,
              direction: "rtl", textAlign: "right", opacity: 0.85,
            }}>
              {side.arabic}
            </div>
            <div style={{
              color: "#c4b49a", fontSize: 13, fontFamily: "Georgia, serif", lineHeight: 1.7,
            }}>
              {side.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 14, padding: "10px 14px",
        background: `${ring.color}15`, borderRadius: 6,
        borderLeft: `3px solid ${ring.color}`,
      }}>
        <span style={{ color: "#c4b49a", fontSize: 12, fontFamily: "serif" }}>
          <span style={{ color: ring.color }}>Mirror theme:</span> {pair.a.theme} — these two sections balance each other structurally and thematically, pointing inward toward the center.
        </span>
      </div>
    </div>
  );
}

// ── Verse Proof Section ──────────────────────────────────────────────────────

function VerseProof({
  surah,
  verses,
  loading,
  selectedRingLabel,
  onSelectRing,
}: {
  surah: RingSurah;
  verses: FetchedVerse[];
  loading: boolean;
  selectedRingLabel: string | null;
  onSelectRing: (label: string | null) => void;
}) {
  return (
    <div style={{
      marginTop: 48,
      padding: "28px",
      background: "#ffffff04",
      border: "1px solid #C8A97E15",
      borderRadius: 12,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 6 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#C8A97E", opacity: 0.7 }}>
          VERSE MAP
        </div>
        <div style={{ fontSize: 11, color: "#5a4a38" }}>
          structural proof — every ayah colour-coded by ring membership
        </div>
      </div>
      <p style={{ margin: "0 0 24px", fontSize: 12, color: "#4a3a28", fontFamily: "serif" }}>
        Click a verse to highlight its ring in the diagram above. The mirroring becomes visible — verses at opposite ends share the same colour.
      </p>

      {loading ? (
        <div style={{ color: "#5a4a38", fontSize: 13, fontFamily: "serif", padding: "20px 0" }}>
          Loading verses…
        </div>
      ) : verses.length === 0 ? (
        <div style={{ color: "#5a4a38", fontSize: 13, fontFamily: "serif", padding: "20px 0" }}>
          Verse text unavailable for this surah.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {verses.map((v) => {
            const ring = getVerseRingLabel(surah, v.number);
            const isHighlighted = ring && selectedRingLabel === ring.label.replace("′", "");
            const isCentre = ring?.side === "center";

            return (
              <div
                key={v.number}
                onClick={() => {
                  if (!ring) return;
                  const baseLabel = ring.label.replace("′", "");
                  onSelectRing(selectedRingLabel === baseLabel ? null : baseLabel);
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 28px 1fr auto",
                  gap: 16,
                  alignItems: "start",
                  padding: "14px 16px",
                  borderRadius: 8,
                  marginBottom: 2,
                  cursor: ring ? "pointer" : "default",
                  background: isHighlighted
                    ? `${ring!.color}12`
                    : isCentre
                    ? "#C8A97E08"
                    : "transparent",
                  border: isHighlighted
                    ? `1px solid ${ring!.color}30`
                    : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                {/* Verse number */}
                <div style={{
                  color: "#5a4a38", fontSize: 11,
                  fontFamily: "serif", paddingTop: 2,
                }}>
                  {v.number}
                </div>

                {/* Ring label badge */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  paddingTop: 2,
                }}>
                  {ring ? (
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      border: `1.5px solid ${ring.color}`,
                      background: `${ring.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, color: ring.color, fontFamily: "serif", fontWeight: "bold",
                    }}>
                      {ring.label === "X" ? "X" : ring.side === "a" ? ring.label : `${ring.label.replace("′","")}'`}
                    </div>
                  ) : (
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      border: "1px solid #2a2018",
                    }} />
                  )}
                </div>

                {/* English translation */}
                <div style={{
                  color: ring ? (isHighlighted ? "#e8d9c0" : "#8a7a65") : "#4a3a28",
                  fontSize: 13, fontFamily: "Georgia, serif", lineHeight: 1.7,
                }}>
                  {v.text}
                </div>

                {/* Arabic */}
                <div style={{
                  color: ring ? (isHighlighted ? ring.color : `${ring.color}80`) : "#3a2a18",
                  fontSize: 16, fontFamily: "serif", lineHeight: 2,
                  direction: "rtl", textAlign: "right", maxWidth: 320,
                }}>
                  {v.arabic}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSurahKey, setActiveSurahKey] = useState("fatiha");
  const [selection, setSelection] = useState<SelectionPayload | null>(null);
  const [verses, setVerses] = useState<FetchedVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);

  const surah = SURAHS[activeSurahKey];
  const selectedRingLabel = selection?.ring.label ?? null;

  // Fetch verses when surah changes
  useEffect(() => {
    setVerses([]);
    setLoadingVerses(true);
    fetchSurahVerses(surah.number)
      .then(setVerses)
      .catch(() => setVerses([]))
      .finally(() => setLoadingVerses(false));
  }, [surah.number]);

  function handleSelectSurah(key: string) {
    setActiveSurahKey(key);
    setSelection(null);
  }

  function handleSelectPair(sel: SelectionPayload) {
    setSelection((prev) =>
      prev?.ring.label === sel.ring.label ? null : sel
    );
  }

  function handleSelectRingFromProof(label: string | null) {
    if (!label) { setSelection(null); return; }
    const ring = surah.rings.find((r) => r.label === label);
    if (!ring) return;
    const pair = ring.pairs[0];
    setSelection({ ring, pair, side: "a" });
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0b08",
      color: "#e8d9c0", fontFamily: "Georgia, serif",
      padding: "0 0 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700&family=Cormorant+Garamond:ital,wght@0,400;0,600&display=swap');
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0b08; }
        ::-webkit-scrollbar-thumb { background: #C8A97E40; border-radius: 2px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{
        borderBottom: "1px solid #C8A97E20",
        padding: "28px 32px 22px",
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontSize: 11, letterSpacing: 4, color: "#C8A97E", textTransform: "uppercase", opacity: 0.7 }}>
            Quran
          </span>
          <span style={{ color: "#C8A97E30", fontSize: 11 }}>◆</span>
          <span style={{ fontSize: 11, letterSpacing: 4, color: "#C8A97E", textTransform: "uppercase", opacity: 0.7 }}>
            Ring Composition
          </span>
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: "normal", color: "#e8d9c0", letterSpacing: 1 }}>
          Mizaan — Structural Symmetry Visualizer
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: "#8a7a65", lineHeight: 1.6, maxWidth: 560 }}>
          Each ring mirrors its counterpart. Click a node to explore the paired verses and their shared theological theme.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── Surah Selector ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          {Object.values(SURAHS).map((s) => (
            <button
              key={s.key}
              onClick={() => handleSelectSurah(s.key)}
              style={{
                background: activeSurahKey === s.key ? "#C8A97E18" : "transparent",
                border: `1px solid ${activeSurahKey === s.key ? "#C8A97E" : "#C8A97E30"}`,
                color: activeSurahKey === s.key ? "#C8A97E" : "#8a7a65",
                borderRadius: 6, padding: "8px 18px",
                cursor: "pointer", fontFamily: "serif", fontSize: 13,
                letterSpacing: 1, transition: "all 0.2s",
              }}
            >
              {s.number}. {s.name}
              <span style={{ marginLeft: 8, opacity: 0.5, fontSize: 12 }}>{s.arabic}</span>
            </button>
          ))}
          <div style={{
            marginLeft: "auto", display: "flex", alignItems: "center",
            color: "#3a2a18", fontSize: 12, fontFamily: "serif", letterSpacing: 1,
          }}>
            + more surahs coming
          </div>
        </div>

        {/* ── Main two-column grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

          {/* Left — Diagram */}
          <div>
            <RingDiagram
              surah={surah}
              onSelectPair={handleSelectPair}
              selectedRingLabel={selectedRingLabel}
            />
            {/* Center info */}
            <div style={{
              marginTop: 16, padding: "14px 18px",
              background: "#C8A97E0d", border: "1px solid #C8A97E25",
              borderRadius: 8, textAlign: "center",
            }}>
              <div style={{ color: "#C8A97E", fontSize: 11, letterSpacing: 2, marginBottom: 6 }}>
                ✦ CENTER · X · VERSE {surah.center.verse}
              </div>
              <div style={{ color: "#c4b49a", fontSize: 13, lineHeight: 1.6 }}>
                {surah.center.label}
              </div>
            </div>
          </div>

          {/* Right — Ring legend + pair detail */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#5a4a38", marginBottom: 14 }}>
                RING STRUCTURE
              </div>
              {surah.rings.map((ring) => (
                <div
                  key={ring.label}
                  onClick={() => handleSelectRingFromProof(
                    selectedRingLabel === ring.label ? null : ring.label
                  )}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    padding: "12px 10px",
                    borderBottom: "1px solid #ffffff08",
                    cursor: "pointer",
                    borderRadius: 6,
                    background: selectedRingLabel === ring.label ? `${ring.color}10` : "transparent",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 52 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: ring.color, flexShrink: 0,
                    }} />
                    <span style={{ color: ring.color, fontFamily: "serif", fontSize: 14, fontWeight: "bold" }}>
                      {ring.label}↔{ring.label}′
                    </span>
                  </div>
                  <div>
                    <div style={{ color: "#c4b49a", fontSize: 12, marginBottom: 3 }}>
                      {ring.pairs[0].a.theme}
                    </div>
                    <div style={{ color: "#5a4a38", fontSize: 11 }}>
                      v.{ring.pairs[0].a.verse} mirrors v.{ring.pairs[0].b.verse}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!selection ? (
              <div style={{
                padding: "16px 18px",
                background: "#ffffff05", border: "1px solid #ffffff08",
                borderRadius: 8, fontSize: 12, color: "#6a5a48", lineHeight: 1.8,
              }}>
                <div style={{ color: "#8a7a65", marginBottom: 8, letterSpacing: 1 }}>HOW TO READ</div>
                Each lettered ring (A, B, C…) has a mirror pair (A′, B′, C′).
                The further out the ring, the more it "wraps" the surah.
                Everything points inward to the{" "}
                <span style={{ color: "#C8A97E" }}>X center</span> — the core message.
                <br /><br />
                <span style={{ color: "#C8A97E60" }}>↑ Click any node or ring row to explore</span>
              </div>
            ) : (
              <PairDetail selection={selection} onClose={() => setSelection(null)} />
            )}
          </div>
        </div>

        {/* ── Verse Proof Section ── */}
        <VerseProof
          surah={surah}
          verses={verses}
          loading={loadingVerses}
          selectedRingLabel={selectedRingLabel}
          onSelectRing={handleSelectRingFromProof}
        />

        {/* ── Roadmap ── */}
        <div style={{
          marginTop: 48, padding: "24px 28px",
          background: "#ffffff04", border: "1px solid #C8A97E15",
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#C8A97E", marginBottom: 20, opacity: 0.7 }}>
            PROJECT ROADMAP
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { phase: "Phase 1", label: "Ring Visualizer", status: "live", desc: "Al-Fatiha, Al-Baqarah, Al-Ikhlas, Al-Nas mapped. Interactive diagram + verse proof." },
              { phase: "Phase 2", label: "All 114 Surahs", status: "next", desc: "Scholarly maps for all documented surahs. AI-generated structure for the rest." },
              { phase: "Phase 3", label: "NLP Theme Tagging", status: "planned", desc: "Claude AI tags shared themes across every mirror pair automatically." },
              { phase: "Phase 4", label: "Cross-Surah Graph", status: "planned", desc: "Neo4j graph. All mirror pairs. Thematic connections across the entire Quran." },
            ].map((p) => (
              <div key={p.phase} style={{
                padding: "14px 16px",
                background: p.status === "live" ? "#C8A97E10" : "#ffffff04",
                border: `1px solid ${p.status === "live" ? "#C8A97E40" : "#ffffff0a"}`,
                borderRadius: 8,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ color: "#5a4a38", fontSize: 10, letterSpacing: 1 }}>{p.phase}</span>
                  <span style={{
                    fontSize: 9, letterSpacing: 1, padding: "2px 6px", borderRadius: 4,
                    background: p.status === "live" ? "#C8A97E30" : p.status === "next" ? "#8FB4A820" : "#ffffff08",
                    color: p.status === "live" ? "#C8A97E" : p.status === "next" ? "#8FB4A8" : "#5a4a38",
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ color: "#c4b49a", fontSize: 12, marginBottom: 6 }}>{p.label}</div>
                <div style={{ color: "#5a4a38", fontSize: 11, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
