import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CircleOfFifthsProps {
  activeNote?: string;
  onNoteClick?: (note: string) => void;
}

const FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({ activeNote, onNoteClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<string>()
      .value(1)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<string>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .padAngle(0.02);

    const slices = g.selectAll('.slice')
      .data(pie(FIFTHS))
      .enter()
      .append('g')
      .attr('class', 'slice')
      .style('cursor', 'pointer')
      .on('click', (event, d) => onNoteClick?.(d.data));

    slices.append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data === activeNote ? '#10b981' : '#18181b')
      .attr('stroke', '#3f3f46')
      .attr('stroke-width', 1)
      .transition()
      .duration(300);

    slices.append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => d.data === activeNote ? '#000' : '#a1a1aa')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text((d) => d.data);

    // Inner circle for minor keys (optional, but let's keep it simple for now)
    g.append('circle')
      .attr('r', radius * 0.55)
      .attr('fill', 'none')
      .attr('stroke', '#27272a')
      .attr('stroke-dasharray', '4 4');

  }, [activeNote, onNoteClick]);

  return (
    <div className="flex justify-center items-center bg-zinc-950 rounded-xl p-4 border border-zinc-800 shadow-2xl">
      <svg ref={svgRef} width="400" height="400" viewBox="0 0 400 400" className="max-w-full h-auto" />
    </div>
  );
};
