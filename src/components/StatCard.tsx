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
      bg: 'bg-teal-500/10 dark:bg-teal-500/5',
      iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      border: 'hover:border-teal-500/30',
      stroke: '#0d9488',
      fill: 'rgba(13, 148, 136, 0.1)',
      glow: 'shadow-teal-500/5'
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/5',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-500/30',
      stroke: '#10b981',
      fill: 'rgba(16, 185, 129, 0.1)',
      glow: 'shadow-emerald-500/5'
    },
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/5',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      border: 'hover:border-blue-500/30',
      stroke: '#2563eb',
      fill: 'rgba(37, 99, 235, 0.1)',
      glow: 'shadow-blue-500/5'
    },
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/5',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      border: 'hover:border-indigo-500/30',
      stroke: '#4f46e5',
      fill: 'rgba(79, 70, 229, 0.1)',
      glow: 'shadow-indigo-500/5'
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/5',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-500/30',
      stroke: '#9333ea',
      fill: 'rgba(147, 51, 234, 0.1)',
      glow: 'shadow-purple-500/5'
    },
    rose: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/5',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      border: 'hover:border-rose-500/30',
      stroke: '#e11d48',
      fill: 'rgba(225, 29, 72, 0.1)',
      glow: 'shadow-rose-500/5'
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/5',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-500/30',
      stroke: '#d97706',
      fill: 'rgba(217, 119, 6, 0.1)',
      glow: 'shadow-amber-500/5'
    }
  };

  const scheme = colorMap[color] || colorMap.teal;

  // Generate SVG Path for Sparkline
  const generateSparklinePath = (data: number[]) => {
    if (!data || data.length < 2) return '';
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
    <div className={`p-6 rounded-2xl border border-border glass-panel hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${scheme.border} ${scheme.glow} flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            {title}
          </span>
          <h3 className="text-3xl font-bold tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${scheme.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div className="space-y-1">
          {/* Trend Indicator */}
          <div className="flex items-center gap-1">
            {trend.type === 'up' && (
              <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                {trend.value}
              </span>
            )}
            {trend.type === 'down' && (
              <span className="flex items-center gap-0.5 text-xs font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-full">
                <ArrowDownRight className="h-3 w-3" />
                {trend.value}
              </span>
            )}
            {trend.type === 'neutral' && (
              <span className="flex items-center gap-0.5 text-xs font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                <Minus className="h-3 w-3" />
                {trend.value}
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium block">
            {subtext}
          </span>
        </div>

        {/* Mini Sparkline Chart */}
        {path && typeof path === 'object' && (
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
