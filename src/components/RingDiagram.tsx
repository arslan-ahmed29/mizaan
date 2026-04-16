import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { RingSurah, Ring, RingPair } from "../types";

interface SelectionPayload { ring: Ring; pair: RingPair; side: "a" | "b" }

interface Props {
  surah: RingSurah;
  onSelectPair: (sel: SelectionPayload) => void;
  selectedRingLabel: string | null;
}

const W = 600;
const CX = 300;
const CY = 300;
const CENTER_R = 56;
const RING_GAP = 56;
const NODE_R = 16;          // larger tap target
const NODE_R_ACTIVE = 20;

export default function RingDiagram({ surah, onSelectPair, selectedRingLabel }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // Gradients
    const bg = defs.append("radialGradient").attr("id", "bgGrad").attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    bg.append("stop").attr("offset", "0%").attr("stop-color", "#1e1810");
    bg.append("stop").attr("offset", "100%").attr("stop-color", "#0d0b08");

    surah.rings.forEach((ring) => {
      const g = defs.append("radialGradient").attr("id", `rg${ring.label}`).attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
      g.append("stop").attr("offset", "0%").attr("stop-color", ring.color).attr("stop-opacity", "0.22");
      g.append("stop").attr("offset", "100%").attr("stop-color", ring.color).attr("stop-opacity", "0.04");
    });

    // Glow filter
    const glow = defs.append("filter").attr("id", "glow").attr("x", "-30%").attr("y", "-30%").attr("width", "160%").attr("height", "160%");
    glow.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
    const fm = glow.append("feMerge");
    fm.append("feMergeNode").attr("in", "blur");
    fm.append("feMergeNode").attr("in", "SourceGraphic");

    // Node glow
    const nodeGlow = defs.append("filter").attr("id", "nodeGlow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    nodeGlow.append("feGaussianBlur").attr("stdDeviation", "6").attr("result", "blur");
    const fm2 = nodeGlow.append("feMerge");
    fm2.append("feMergeNode").attr("in", "blur");
    fm2.append("feMergeNode").attr("in", "SourceGraphic");

    // Background
    svg.append("circle").attr("cx", CX).attr("cy", CY).attr("r", CX).attr("fill", "url(#bgGrad)");

    // Geometric lines
    const outerR = surah.rings.length * RING_GAP + CENTER_R + 20;
    d3.range(12).forEach((i) => {
      const a = (i / 12) * Math.PI * 2;
      svg.append("line")
        .attr("x1", CX).attr("y1", CY)
        .attr("x2", CX + Math.cos(a) * outerR).attr("y2", CY + Math.sin(a) * outerR)
        .attr("stroke", "#C8A97E").attr("stroke-opacity", "0.05").attr("stroke-width", "1");
    });

    // Rings (outermost first)
    [...surah.rings].reverse().forEach((ring) => {
      const r = CENTER_R + ring.level * RING_GAP;
      const active = selectedRingLabel === ring.label;
      svg.append("circle")
        .attr("cx", CX).attr("cy", CY).attr("r", r)
        .attr("fill", `url(#rg${ring.label})`)
        .attr("stroke", ring.color)
        .attr("stroke-width", active ? 2.5 : 1.2)
        .attr("stroke-opacity", active ? 0.9 : 0.4);
    });

    // Center
    svg.append("circle").attr("cx", CX).attr("cy", CY).attr("r", CENTER_R)
      .attr("fill", "#1e1812").attr("stroke", "#C8A97E").attr("stroke-width", 2).attr("filter", "url(#glow)");
    svg.append("circle").attr("cx", CX).attr("cy", CY).attr("r", CENTER_R - 8)
      .attr("fill", "none").attr("stroke", "#C8A97E").attr("stroke-width", 0.5).attr("stroke-opacity", 0.3);
    svg.append("text").attr("x", CX).attr("y", CY - 9)
      .attr("text-anchor", "middle").attr("fill", "#C8A97E")
      .attr("font-size", 13).attr("font-family", "serif").attr("font-weight", "bold").text("X");
    svg.append("text").attr("x", CX).attr("y", CY + 7)
      .attr("text-anchor", "middle").attr("fill", "#C8A97E")
      .attr("font-size", 8).attr("font-family", "serif").attr("opacity", 0.7).text("CENTER");
    svg.append("text").attr("x", CX).attr("y", CY + 20)
      .attr("text-anchor", "middle").attr("fill", "#C8A97E")
      .attr("font-size", 8).attr("font-family", "serif").attr("opacity", 0.5).text(`v.${surah.center.verse}`);

    // Ring nodes + labels
    surah.rings.forEach((ring) => {
      const r = CENTER_R + ring.level * RING_GAP;
      const active = selectedRingLabel === ring.label;
      // Nodes placed left/right of top, so they're easy to tap
      const angles = [-Math.PI / 2 - 0.32, -Math.PI / 2 + 0.32];

      // Side labels
      svg.append("text")
        .attr("x", CX - r - 6).attr("y", CY + 5)
        .attr("text-anchor", "end").attr("fill", ring.color)
        .attr("font-size", 14).attr("font-family", "serif").attr("font-weight", "bold")
        .attr("opacity", active ? 1 : 0.8).text(ring.label);
      svg.append("text")
        .attr("x", CX + r + 6).attr("y", CY + 5)
        .attr("text-anchor", "start").attr("fill", ring.color)
        .attr("font-size", 14).attr("font-family", "serif").attr("font-weight", "bold")
        .attr("opacity", active ? 1 : 0.8).text(`${ring.label}′`);

      ring.pairs.forEach((pair) => {
        angles.forEach((angle, idx) => {
          const nx = CX + Math.cos(angle) * r;
          const ny = CY + Math.sin(angle) * r;
          const nr = active ? NODE_R_ACTIVE : NODE_R;
          const side = idx === 0 ? "a" : "b";
          const nodeLabel = idx === 0 ? ring.label : `${ring.label}′`;

          // Invisible large hit area
          svg.append("circle")
            .attr("cx", nx).attr("cy", ny).attr("r", NODE_R_ACTIVE + 8)
            .attr("fill", "transparent").attr("cursor", "pointer")
            .on("click", () => onSelectPair({ ring, pair, side }));

          // Visible node
          svg.append("circle")
            .attr("cx", nx).attr("cy", ny).attr("r", nr)
            .attr("fill", active ? ring.color : "transparent")
            .attr("fill-opacity", active ? 0.35 : 0)
            .attr("stroke", ring.color).attr("stroke-width", active ? 2.5 : 1.8)
            .attr("filter", active ? "url(#nodeGlow)" : "none")
            .attr("cursor", "pointer")
            .style("transition", "all 0.2s")
            .on("click", () => onSelectPair({ ring, pair, side }));

          // Node label
          svg.append("text")
            .attr("x", nx).attr("y", ny + 4.5)
            .attr("text-anchor", "middle").attr("fill", ring.color)
            .attr("font-size", active ? 9 : 8).attr("font-family", "serif")
            .attr("pointer-events", "none")
            .attr("font-weight", active ? "bold" : "normal")
            .text(nodeLabel);

          // Verse number below node
          svg.append("text")
            .attr("x", nx).attr("y", ny + nr + 14)
            .attr("text-anchor", "middle").attr("fill", ring.color)
            .attr("font-size", 7).attr("font-family", "serif")
            .attr("opacity", active ? 0.8 : 0.4)
            .attr("pointer-events", "none")
            .text(`v.${idx === 0 ? pair.a.verse : pair.b.verse}`);
        });

        // Dashed mirror line between nodes
        svg.append("line")
          .attr("x1", CX + Math.cos(angles[0]) * (r - NODE_R)).attr("y1", CY + Math.sin(angles[0]) * (r - NODE_R))
          .attr("x2", CX + Math.cos(angles[1]) * (r - NODE_R)).attr("y2", CY + Math.sin(angles[1]) * (r - NODE_R))
          .attr("stroke", ring.color).attr("stroke-width", active ? 1 : 0.5)
          .attr("stroke-opacity", active ? 0.5 : 0.2).attr("stroke-dasharray", "3,3");
      });
    });

    // Surah name
    svg.append("text").attr("x", CX).attr("y", 26)
      .attr("text-anchor", "middle").attr("fill", "#C8A97E")
      .attr("font-size", 12).attr("font-family", "serif")
      .attr("opacity", 0.6).attr("letter-spacing", "3").text(surah.name.toUpperCase());
    svg.append("text").attr("x", CX).attr("y", 48)
      .attr("text-anchor", "middle").attr("fill", "#C8A97E")
      .attr("font-size", 20).attr("font-family", "serif")
      .attr("opacity", 0.4).text(surah.arabic);

  }, [surah, selectedRingLabel, onSelectPair]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${W}`}
      style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto", cursor: "default" }}
    />
  );
}
