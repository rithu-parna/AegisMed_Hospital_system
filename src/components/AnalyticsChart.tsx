'use client';

import React, { useState } from 'react';

interface ChartDataItem {
  label: string;
  value1: number;
  value2?: number;
}

interface AnalyticsChartProps {
  type: 'line' | 'bar';
  data: ChartDataItem[];
  value1Label: string;
  value2Label?: string;
  title: string;
  color?: 'teal' | 'indigo' | 'emerald';
}

export default function AnalyticsChart({
  type,
  data,
  value1Label,
  value2Label,
  title,
  color = 'teal'
}: AnalyticsChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 500;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max values for scaling
  const allValues = data.flatMap(d => [d.value1, d.value2 || 0]);
  const maxValue = Math.max(...allValues, 100); // default minimum ceiling
  const roundedMax = Math.ceil(maxValue / 50) * 50; // round up to multiple of 50

  // Colors
  const colors = {
    teal: {
      stroke1: '#0d9488',
      fill1: 'url(#tealGradient)',
      stroke2: '#06b6d4',
      fill2: 'url(#cyanGradient)',
      bar1: '#0d9488',
      bar2: '#06b6d4'
    },
    indigo: {
      stroke1: '#4f46e5',
      fill1: 'url(#indigoGradient)',
      stroke2: '#a855f7',
      fill2: 'url(#purpleGradient)',
      bar1: '#4f46e5',
      bar2: '#a855f7'
    },
    emerald: {
      stroke1: '#10b981',
      fill1: 'url(#emeraldGradient)',
      stroke2: '#3b82f6',
      fill2: 'url(#blueGradient)',
      bar1: '#10b981',
      bar2: '#3b82f6'
    }
  };

  const activeColors = colors[color];

  // Grid ticks
  const ticks = 4;
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) => (roundedMax / ticks) * i);

  // Line/Area points calculation
  const getCoordinates = () => {
    return data.map((d, idx) => {
      const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
      const y1 = paddingTop + chartHeight - (d.value1 / roundedMax) * chartHeight;
      const y2 = d.value2 !== undefined 
        ? paddingTop + chartHeight - (d.value2 / roundedMax) * chartHeight 
        : undefined;
      return { x, y1, y2, label: d.label, val1: d.value1, val2: d.value2 };
    });
  };

  const coords = getCoordinates();

  // Create paths for lines/areas
  const linePath1 = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y1}`).join(' ');
  const areaPath1 = coords.length > 0 
    ? `${linePath1} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${coords[0].x} ${paddingTop + chartHeight} Z`
    : '';

  const linePath2 = value2Label && coords[0]?.y2 !== undefined
    ? coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y2}`).join(' ')
    : '';
  const areaPath2 = value2Label && coords[0]?.y2 !== undefined
    ? `${linePath2} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${coords[0].x} ${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="p-6 rounded-2xl border border-border glass-panel w-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-base">{title}</h4>
        {/* Legends */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-teal-500" style={{ backgroundColor: activeColors.stroke1 }} />
            <span className="text-muted-foreground">{value1Label}</span>
          </div>
          {value2Label && (
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-cyan-500" style={{ backgroundColor: activeColors.stroke2 }} />
              <span className="text-muted-foreground">{value2Label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <svg className="w-full h-60 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            {/* Gradients */}
            <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y Axis Ticks */}
          {tickValues.map((val, idx) => {
            const y = paddingTop + chartHeight - (val / roundedMax) * chartHeight;
            return (
              <g key={idx} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  className="text-border"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  className="fill-muted-foreground font-semibold"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Area & Line Chart Drawing */}
          {type === 'line' && (
            <>
              {/* Dataset 1 Area & Line */}
              <path d={areaPath1} fill={activeColors.fill1} />
              <path d={linePath1} fill="transparent" stroke={activeColors.stroke1} strokeWidth="2.5" strokeLinecap="round" />

              {/* Dataset 2 Area & Line (if present) */}
              {value2Label && areaPath2 && (
                <>
                  <path d={areaPath2} fill={activeColors.fill2} />
                  <path d={linePath2} fill="transparent" stroke={activeColors.stroke2} strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}

              {/* Interactive Dots & Hover Bars */}
              {coords.map((c, idx) => (
                <g 
                  key={idx} 
                  onMouseEnter={() => setHoveredIdx(idx)} 
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer"
                >
                  {/* Vertical hover overlay bar */}
                  {hoveredIdx === idx && (
                    <line
                      x1={c.x}
                      y1={paddingTop}
                      x2={c.x}
                      y2={paddingTop + chartHeight}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-primary/20"
                    />
                  )}
                  {/* Point 1 dot */}
                  <circle
                    cx={c.x}
                    cy={c.y1}
                    r={hoveredIdx === idx ? 5 : 3.5}
                    fill={activeColors.stroke1}
                    stroke="var(--color-card)"
                    strokeWidth="1.5"
                  />
                  {/* Point 2 dot */}
                  {c.y2 !== undefined && (
                    <circle
                      cx={c.x}
                      cy={c.y2}
                      r={hoveredIdx === idx ? 5 : 3.5}
                      fill={activeColors.stroke2}
                      stroke="var(--color-card)"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              ))}
            </>
          )}

          {/* Bar Chart Drawing */}
          {type === 'bar' && (
            <>
              {coords.map((c, idx) => {
                const barSpacing = chartWidth / data.length;
                const barWidth = value2Label ? barSpacing * 0.3 : barSpacing * 0.5;
                
                // Position offset for dual bars
                const x1 = c.x - (value2Label ? barWidth + 2 : barWidth / 2);
                const x2 = c.x + 2;

                const h1 = (c.val1 / roundedMax) * chartHeight;
                const y1 = paddingTop + chartHeight - h1;

                const h2 = c.val2 !== undefined ? (c.val2 / roundedMax) * chartHeight : 0;
                const y2 = paddingTop + chartHeight - h2;

                return (
                  <g 
                    key={idx}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer"
                  >
                    {/* Hover highlights */}
                    {hoveredIdx === idx && (
                      <rect
                        x={c.x - barSpacing/2}
                        y={paddingTop}
                        width={barSpacing}
                        height={chartHeight}
                        fill="currentColor"
                        className="fill-muted/20"
                        rx="4"
                      />
                    )}
                    {/* Bar 1 */}
                    <rect
                      x={x1}
                      y={y1}
                      width={barWidth}
                      height={Math.max(h1, 2)}
                      fill={activeColors.bar1}
                      rx="3"
                      className="transition-all duration-200"
                    />
                    {/* Bar 2 (if present) */}
                    {value2Label && c.val2 !== undefined && (
                      <rect
                        x={x2}
                        y={y2}
                        width={barWidth}
                        height={Math.max(h2, 2)}
                        fill={activeColors.bar2}
                        rx="3"
                        className="transition-all duration-200"
                      />
                    )}
                  </g>
                );
              })}
            </>
          )}

          {/* X Axis Labels */}
          {coords.map((c, idx) => {
            // Show every label if <= 8 items, else show every alternate to prevent overlap
            const showLabel = coords.length <= 8 || idx % 2 === 0;
            if (!showLabel) return null;
            return (
              <text
                key={idx}
                x={c.x}
                y={paddingTop + chartHeight + 18}
                textAnchor="middle"
                fontSize="9"
                className="fill-muted-foreground font-semibold"
              >
                {c.label}
              </text>
            );
          })}

          {/* X Axis Bottom Line */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div 
            className="absolute z-20 bg-card border border-border rounded-xl p-3 shadow-xl text-xs space-y-1 backdrop-blur-md pointer-events-none transition-all duration-150"
            style={{
              left: `${Math.min(
                Math.max(coords[hoveredIdx].x - 60, paddingLeft),
                width - 150
              )}px`,
              top: `${Math.min(
                Math.max(coords[hoveredIdx].y1 - 70, paddingTop),
                height - 90
              )}px`
            }}
          >
            <p className="font-bold border-b border-border pb-1 mb-1">
              {data[hoveredIdx].label}
            </p>
            <p className="flex items-center justify-between gap-4 font-semibold">
              <span className="text-muted-foreground">{value1Label}:</span>
              <span className="text-primary font-bold">{data[hoveredIdx].value1}</span>
            </p>
            {value2Label && data[hoveredIdx].value2 !== undefined && (
              <p className="flex items-center justify-between gap-4 font-semibold">
                <span className="text-muted-foreground">{value2Label}:</span>
                <span className="text-cyan-500 font-bold">{data[hoveredIdx].value2}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
