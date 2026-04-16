import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { RingSurah, Ring, RingPair } from "../types";

interface SelectionPayload {
  ring: Ring;
  pair: RingPair;
  side: "a" | "b";
}

interface Props {
  surah: RingSurah;
  onSelectPair: (sel: SelectionPayload) => void;
  selectedRingLabel: string | null;
}

const W = 600;
const CX = 300;
const CY = 300;
const CENTER_R = 52;
const RING_GAP = 52;

export default function RingDiagram({ surah, onSelectPair, selectedRingLabel }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // Background gradient
    const bg = defs.append("radialGradient").attr("id", "bgGrad").attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    bg.append("stop").attr("offset", "0%").attr("stop-color", "#1a1410");
    bg.append("stop").attr("offset", "100%").attr("stop-color", "#0d0b08");

    // Per-ring fill gradients
    surah.rings.forEach((ring) => {
      const g = defs.append("radialGradient")
        .attr("id", `ringGrad${ring.label}`)
        .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
      g.append("stop").attr("offset", "0%").attr("stop-color", ring.color).attr("stop-opacity", "0.35");
      g.append("stop").attr("offset", "100%").attr("stop-color", ring.color).attr("stop-opacity", "0.08");
    });

    // Glow filter
    const glow = defs.append("filter").attr("id", "glow");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const fm = glow.append("feMerge");
    fm.append("feMergeNode").attr("in", "coloredBlur");
    fm.append("feMergeNode").attr("in", "SourceGraphic");

    // Soft glow
    const softGlow = defs.append("filter").attr("id", "softGlow");
    softGlow.append("feGaussianBlur").attr("stdDeviation", "1.5").attr("result", "coloredBlur");
    const fm2 = softGlow.append("feMerge");
    fm2.append("feMergeNode").attr("in", "coloredBlur");
    fm2.append("feMergeNode").attr("in", "SourceGraphic");

    // Background circle
    svg.append("circle").attr("cx", CX).attr("cy", CY).attr("r", CX).attr("fill", "url(#bgGrad)");

    // Geometric radial lines
    const totalR = surah.rings.length * RING_GAP + CENTER_R + 30;
    d3.range(12).forEach((i) => {
      const angle = (i / 12) * Math.PI * 2;
      svg.append("line")
        .attr("x1", CX).attr("y1", CY)
        .attr("x2", CX + Math.cos(angle) * totalR)
        .attr("y2", CY + Math.sin(angle) * totalR)
        .attr("stroke", "#C8A97E").attr("stroke-opacity", "0.06").attr("stroke-width", "1");
    });

    // Rings — outermost first
    [...surah.rings].reverse().forEach((ring) => {
      const r = CENTER_R + ring.level * RING_GAP;
      const isSelected = selectedRingLabel === ring.label;
      svg.append("circle")
        .attr("cx", CX).attr("cy", CY).attr("r", r)
        .attr("fill", `url(#ringGrad${ring.label})`)
        .attr("stroke", ring.color)
        .attr("stroke-width", isSelected ? 2 : 1.5)
        .attr("stroke-opacity", isSelected ? 1 : 0.5);
    });

    // Center circle
    svg.append("circle").attr("cx", CX).attr("cy", CY).attr("r", CENTER_R)
      .attr("fill", "#1e1812").attr("stroke", "#C8A97E").attr("stroke-width", 2)
      .attr("filter", "url(#glow)");
    svg.append("circle").attr("cx", CX).attr("cy", CY).attr("r", CENTER_R - 6)
      .attr("fill", "none").attr("stroke", "#C8A97E").attr("stroke-width", 0.5).attr("stroke-opacity", 0.4);
    svg.append("text").attr("x", CX).attr("y", CY - 8).attr("text-anchor", "middle")
      .attr("fill", "#C8A97E").attr("font-size", 11).attr("font-family", "serif").attr("font-weight", "bold").text("X");
    svg.append("text").attr("x", CX).attr("y", CY + 6).attr("text-anchor", "middle")
      .attr("fill", "#C8A97E").attr("font-size", 8).attr("font-family", "serif").attr("opacity", 0.8).text("CENTER");
    svg.append("text").attr("x", CX).attr("y", CY + 18).attr("text-anchor", "middle")
      .attr("fill", "#C8A97E").attr("font-size", 7).attr("font-family", "serif").attr("opacity", 0.6)
      .text(`v.${surah.center.verse}`);

    // Ring nodes and labels
    surah.rings.forEach((ring) => {
      const r = CENTER_R + ring.level * RING_GAP;
      const nodeAngles = [-Math.PI / 2 - 0.3, -Math.PI / 2 + 0.3];
      const isSelected = selectedRingLabel === ring.label;

      // Left and right ring labels
      svg.append("text")
        .attr("x", CX - r - 4).attr("y", CY + 4)
        .attr("text-anchor", "end").attr("fill", ring.color)
        .attr("font-size", 13).attr("font-family", "serif").attr("font-weight", "bold")
        .attr("opacity", 0.9).text(ring.label);
      svg.append("text")
        .attr("x", CX + r + 4).attr("y", CY + 4)
        .attr("text-anchor", "start").attr("fill", ring.color)
        .attr("font-size", 13).attr("font-family", "serif").attr("font-weight", "bold")
        .attr("opacity", 0.9).text(`${ring.label}′`);

      ring.pairs.forEach((pair) => {
        // Mirror dashed line
        svg.append("line")
          .attr("x1", CX + Math.cos(nodeAngles[0]) * (r - 11))
          .attr("y1", CY + Math.sin(nodeAngles[0]) * (r - 11))
          .attr("x2", CX + Math.cos(nodeAngles[1]) * (r - 11))
          .attr("y2", CY + Math.sin(nodeAngles[1]) * (r - 11))
          .attr("stroke", ring.color).attr("stroke-width", 0.5)
          .attr("stroke-opacity", 0.3).attr("stroke-dasharray", "3,3");

        // A node
        const ax = CX + Math.cos(nodeAngles[0]) * r;
        const ay = CY + Math.sin(nodeAngles[0]) * r;
        svg.append("circle")
          .attr("cx", ax).attr("cy", ay).attr("r", isSelected ? 12 : 10)
          .attr("fill", ring.color).attr("fill-opacity", isSelected ? 0.5 : 0.25)
          .attr("stroke", ring.color).attr("stroke-width", isSelected ? 2 : 1.5)
          .attr("filter", "url(#softGlow)").attr("cursor", "pointer")
          .on("click", () => onSelectPair({ ring, pair, side: "a" }));
        svg.append("text")
          .attr("x", ax).attr("y", ay + 4)
          .attr("text-anchor", "middle").attr("fill", ring.color)
          .attr("font-size", 8).attr("font-family", "serif")
          .attr("pointer-events", "none").text(ring.label);

        // A' node
        const bx = CX + Math.cos(nodeAngles[1]) * r;
        const by = CY + Math.sin(nodeAngles[1]) * r;
        svg.append("circle")
          .attr("cx", bx).attr("cy", by).attr("r", isSelected ? 12 : 10)
          .attr("fill", ring.color).attr("fill-opacity", isSelected ? 0.5 : 0.25)
          .attr("stroke", ring.color).attr("stroke-width", isSelected ? 2 : 1.5)
          .attr("filter", "url(#softGlow)").attr("cursor", "pointer")
          .on("click", () => onSelectPair({ ring, pair, side: "b" }));
        svg.append("text")
          .attr("x", bx).attr("y", by + 4)
          .attr("text-anchor", "middle").attr("fill", ring.color)
          .attr("font-size", 8).attr("font-family", "serif")
          .attr("pointer-events", "none").text(`${ring.label}′`);
      });
    });

    // Surah name
    svg.append("text").attr("x", CX).attr("y", 30).attr("text-anchor", "middle")
      .attr("fill", "#C8A97E").attr("font-size", 14).attr("font-family", "serif")
      .attr("opacity", 0.7).attr("letter-spacing", 2).text(surah.name.toUpperCase());
    svg.append("text").attr("x", CX).attr("y", 50).attr("text-anchor", "middle")
      .attr("fill", "#C8A97E").attr("font-size", 18).attr("font-family", "serif")
      .attr("opacity", 0.5).text(surah.arabic);

  }, [surah, selectedRingLabel, onSelectPair]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${W}`}
      style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}
    />
  );
}
