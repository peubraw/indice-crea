import { scoreColor, scoreLabel } from '@/lib/api';

interface ScoreGaugeProps {
  score: number | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ScoreGauge({ score, size = 'md', showLabel = true }: ScoreGaugeProps) {
  const color = scoreColor(score);
  const label = scoreLabel(score);
  
  const sizes = {
    sm: { svg: 80, stroke: 6, text: 'text-xl', labelText: 'text-xs' },
    md: { svg: 120, stroke: 8, text: 'text-3xl', labelText: 'text-sm' },
    lg: { svg: 160, stroke: 12, text: 'text-5xl', labelText: 'text-base' },
  };
  
  const s = sizes[size];
  const radius = (s.svg - s.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = score === null ? 0 : circumference - ((score / 100) * circumference);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: s.svg, height: s.svg }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx={s.svg / 2}
            cy={s.svg / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={s.stroke}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Foreground circle */}
          <circle
            cx={s.svg / 2}
            cy={s.svg / 2}
            r={radius}
            stroke={color}
            strokeWidth={s.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${s.text}`} style={{ color: score === null ? '#888' : '#333' }}>
            {score === null ? '—' : score.toFixed(1)}
          </span>
        </div>
      </div>
      {showLabel && (
        <span 
          className={`mt-2 font-medium px-2.5 py-0.5 rounded-full ${s.labelText}`}
          style={{ 
            backgroundColor: score === null ? '#f3f4f6' : `${color}15`, 
            color: score === null ? '#6b7280' : color 
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
