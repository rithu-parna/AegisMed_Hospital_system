'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  color: 'teal' | 'emerald' | 'blue' | 'indigo' | 'purple' | 'rose' | 'amber';
  sparkline?: number[];
}

export default function StatCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  trend, 
  color, 
  sparkline 
}: StatCardProps) {
  
  const colorMap = {
    teal: {
      bg: 'from-teal-500/5 to-transparent',
      iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      border: 'hover:border-teal-500/40',
      stroke: '#0d9488',
      fill: 'rgba(13, 148, 136, 0.04)',
      glow: 'hover:shadow-[0_0_25px_rgba(13,148,136,0.12)]'
    },
    emerald: {
      bg: 'from-emerald-500/5 to-transparent',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      border: 'hover:border-emerald-500/40',
      stroke: '#10b981',
      fill: 'rgba(16, 185, 129, 0.04)',
      glow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]'
    },
    blue: {
      bg: 'from-blue-500/5 to-transparent',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      border: 'hover:border-blue-500/40',
      stroke: '#2563eb',
      fill: 'rgba(37, 99, 235, 0.04)',
      glow: 'hover:shadow-[0_0_25px_rgba(37,99,235,0.12)]'
    },
    indigo: {
      bg: 'from-indigo-500/5 to-transparent',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      border: 'hover:border-indigo-500/40',
      stroke: '#4f46e5',
      fill: 'rgba(79, 70, 229, 0.04)',
      glow: 'hover:shadow-[0_0_25px_rgba(79,70,229,0.12)]'
    },
    purple: {
      bg: 'from-purple-500/5 to-transparent',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      border: 'hover:border-purple-500/40',
      stroke: '#9333ea',
      fill: 'rgba(147, 51, 234, 0.04)',
      glow: 'hover:shadow-[0_0_25px_rgba(147,51,234,0.12)]'
    },
    rose: {
      bg: 'from-rose-500/5 to-transparent',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      border: 'hover:border-rose-500/40',
      stroke: '#e11d48',
      fill: 'rgba(225, 29, 72, 0.04)',
      glow: 'hover:shadow-[0_0_25px_rgba(225,29,72,0.12)]'
    },
    amber: {
      bg: 'from-amber-500/5 to-transparent',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      border: 'hover:border-amber-500/40',
      stroke: '#d97706',
      fill: 'rgba(217, 119, 6, 0.04)',
      glow: 'hover:shadow-[0_0_25px_rgba(217,119,6,0.12)]'
    }
  };

  const scheme = colorMap[color] || colorMap.teal;

  // Generate SVG Path for Sparkline
  const generateSparklinePath = (data: number[]) => {
    if (!data || data.length < 2) return null;
    const width = 120;
    const height = 40;
    const padding = 2;
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min === 0 ? 1 : max - min;
    
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    });
    
    return {
      line: `M ${points.join(' L ')}`,
      fill: `M ${points[0].split(',')[0]},${height} L ${points.join(' L ')} L ${points[points.length - 1].split(',')[0]},${height} Z`
    };
  };

  const path = sparkline ? generateSparklinePath(sparkline) : null;

  return (
    <div className={`p-6 premium-card flex flex-col justify-between group relative overflow-hidden`}>
      {/* Dynamic light highlight effect */}
      <span className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest block">
            {title}
          </span>
          <h3 className="text-2xl font-black tracking-tight font-mono text-foreground">
            {value}
          </h3>
        </div>
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${scheme.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-6 z-10">
        <div className="space-y-1.5">
          {/* Trend Indicator */}
          <div className="flex items-center gap-1">
            {trend.type === 'up' && (
              <span className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                {trend.value}
              </span>
            )}
            {trend.type === 'down' && (
              <span className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                <ArrowDownRight className="h-3 w-3 stroke-[2.5]" />
                {trend.value}
              </span>
            )}
            {trend.type === 'neutral' && (
              <span className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
                <Minus className="h-3 w-3" />
                {trend.value}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold block">
            {subtext}
          </span>
        </div>

        {/* Mini Sparkline Chart */}
        {path && (
          <svg className="w-[120px] h-10 overflow-visible" viewBox="0 0 120 40">
            <path
              d={path.fill}
              fill={scheme.fill}
              stroke="transparent"
            />
            <path
              d={path.line}
              fill="transparent"
              stroke={scheme.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
