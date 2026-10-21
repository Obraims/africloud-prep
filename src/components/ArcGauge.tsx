import { useMemo } from 'react';

interface ArcGaugeProps {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
  sublabel?: string;
}

/** Flat-color semicircle gauge built from SVG arcs (no gradients). */
export function ArcGauge({ value, size = 220, thickness = 18, label, sublabel }: ArcGaugeProps) {
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 180;
  const endAngle = 360;

  const describeArc = (fromAngle: number, toAngle: number) => {
    const polar = (angle: number) => {
      const a = (angle * Math.PI) / 180;
      return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
    };
    const start = polar(fromAngle);
    const end = polar(toAngle);
    const large = toAngle - fromAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  };

  const valueAngle = useMemo(() => startAngle + (value / 100) * (endAngle - startAngle), [value]);
  const clamped = Math.max(0, Math.min(100, value));
  const trackEnd = endAngle;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size / 2 + thickness} viewBox={`0 0 ${size} ${size / 2 + thickness}`}>
        <path
          d={describeArc(startAngle, trackEnd)}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          className="stroke-slate-200 dark:stroke-slate-800"
        />
        <path
          d={describeArc(startAngle, valueAngle)}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          className="stroke-indigo-700 dark:stroke-indigo-500"
          style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
        />
      </svg>
      <div className="-mt-14 flex flex-col items-center">
        <span className="text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {clamped}
          <span className="text-2xl font-bold text-slate-400">%</span>
        </span>
        {label && <span className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>}
        {sublabel && <span className="text-xs text-slate-400 dark:text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
}
