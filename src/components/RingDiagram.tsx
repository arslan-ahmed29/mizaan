import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { RingSurah, RingPair } from "../types";

interface Props {
  surah: RingSurah;
  onSelectPair: (pair: RingPair) => void;
  selectedPair: RingPair | null;
}

const WIDTH = 560;
const HEIGHT = 560;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const CENTER_R = 48;
const RING_GAP = 52;

export default function RingDiagram({ surah, onSelectPair, selectedPair }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // Radial gradient for background
    const bgGrad = defs
      .append("radialGradient")
      .attr("id", "bgGrad")
      .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
    bgGrad.append("stop").attr("offset", "0%").attr("stop-color", "#1a1408");
    bgGrad.append("stop").attr("offset", "100%").attr("stop-color", "#0d0b08");

    svg
      .append("rect")
      .attr("width", WIDTH).attr("height", HEIGHT)
      .attr("fill", "url(#bgGrad)");

    const g = svg.append("g");

    const numRings = surah.rings.length;

    // Draw rings from outer to inner
    surah.rings.forEach((ring, i) => {
      const ringIndex = numRings - 1 - i; // outermost ring has largest index
      const r = CENTER_R + (ringIndex + 1) * RING_GAP;
      const isSelected = selectedPair?.label === ring.label;

      // Ring circle
      g.append("circle")
        .attr("cx", CX).attr("cy", CY).attr("r", r)
        .attr("fill", "none")
        .attr("stroke", ring.color)
        .attr("stroke-width", isSelected ? 2.5 : 1.2)
        .attr("stroke-opacity", isSelected ? 1 : 0.55)
        .attr("stroke-dasharray", i === 0 ? "none" : "4 3");

      // Ring label on circle (left side)
      g.append("text")
        .attr("x", CX - r - 10)
        .attr("y", CY)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("fill", ring.color)
        .attr("font-size", 11)
        .attr("font-family", "Cormorant Garamond, serif")
        .attr("font-weight", "600")
        .attr("opacity", 0.85)
        .text(ring.label);

      // Dashed mirror line through center (vertical-ish)
      const nodeTop = { x: CX, y: CY - r };
      const nodeBot = { x: CX, y: CY + r };

      g.append("line")
        .attr("x1", nodeTop.x).attr("y1", nodeTop.y)
        .attr("x2", nodeBot.x).attr("y2", nodeBot.y)
        .attr("stroke", ring.color)
        .attr("stroke-width", 0.8)
        .attr("stroke-dasharray", "3 4")
        .attr("stroke-opacity", 0.3);

      // Node A (top)
      const nodeAGroup = g.append("g")
        .attr("cursor", "pointer")
        .on("click", () => onSelectPair(ring));

      nodeAGroup
        .append("circle")
        .attr("cx", nodeTop.x).attr("cy", nodeTop.y)
        .attr("r", isSelected ? 8 : 6)
        .attr("fill", isSelected ? ring.color : "#0d0b08")
        .attr("stroke", ring.color)
        .attr("stroke-width", isSelected ? 2.5 : 1.5)
        .attr("filter", isSelected ? "url(#glow)" : "none");

      nodeAGroup
        .append("text")
        .attr("x", nodeTop.x + 10)
        .attr("y", nodeTop.y)
        .attr("dominant-baseline", "middle")
        .attr("fill", ring.color)
        .attr("font-size", 10)
        .attr("font-family", "Cormorant Garamond, serif")
        .text(ring.a.verse);

      // Node A' (bottom)
      const nodeBGroup = g.append("g")
        .attr("cursor", "pointer")
        .on("click", () => onSelectPair(ring));

      nodeBGroup
        .append("circle")
        .attr("cx", nodeBot.x).attr("cy", nodeBot.y)
        .attr("r", isSelected ? 8 : 6)
        .attr("fill", isSelected ? ring.color : "#0d0b08")
        .attr("stroke", ring.color)
        .attr("stroke-width", isSelected ? 2.5 : 1.5)
        .attr("filter", isSelected ? "url(#glow)" : "none");

      nodeBGroup
        .append("text")
        .attr("x", nodeBot.x + 10)
        .attr("y", nodeBot.y)
        .attr("dominant-baseline", "middle")
        .attr("fill", ring.color)
        .attr("font-size", 10)
        .attr("font-family", "Cormorant Garamond, serif")
        .text(ring.b.verse);

      // Theme label on right of ring circle
      g.append("text")
        .attr("x", CX + r + 10)
        .attr("y", CY)
        .attr("dominant-baseline", "middle")
        .attr("fill", ring.color)
        .attr("font-size", 10)
        .attr("font-family", "Cormorant Garamond, serif")
        .attr("opacity", 0.75)
        .text(ring.theme);
    });

    // Glow filter
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Center X circle
    g.append("circle")
      .attr("cx", CX).attr("cy", CY).attr("r", CENTER_R)
      .attr("fill", "#1a1408")
      .attr("stroke", "#C8A97E")
      .attr("stroke-width", 1.8);

    g.append("text")
      .attr("x", CX).attr("y", CY - 10)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#C8A97E")
      .attr("font-size", 18)
      .attr("font-family", "Cormorant Garamond, serif")
      .attr("font-weight", "700")
      .text("X");

    g.append("text")
      .attr("x", CX).attr("y", CY + 10)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#C8A97E")
      .attr("font-size", 9)
      .attr("font-family", "Cormorant Garamond, serif")
      .attr("opacity", 0.75)
      .text(surah.center.verse);

    // Surah name at top
    svg.append("text")
      .attr("x", CX).attr("y", 22)
      .attr("text-anchor", "middle")
      .attr("fill", "#C8A97E")
      .attr("font-size", 14)
      .attr("font-family", "Cormorant Garamond, serif")
      .attr("letter-spacing", "0.1em")
      .text(`${surah.name} — Ring Composition`);

    // Arabic name
    svg.append("text")
      .attr("x", CX).attr("y", 44)
      .attr("text-anchor", "middle")
      .attr("fill", "#C8A97E")
      .attr("font-size", 18)
      .attr("font-family", "Amiri, serif")
      .attr("opacity", 0.75)
      .text(surah.arabic);

  }, [surah, selectedPair, onSelectPair]);

  return (
    <svg
      ref={svgRef}
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full max-w-lg mx-auto select-none"
    />
  );
}
