'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { StateDimension } from '@/lib/api';

interface DimensionRadarProps {
  dimensions: Record<string, StateDimension>;
}

export default function DimensionRadar({ dimensions }: DimensionRadarProps) {
  // Only include active dimensions for the radar
  const data = Object.entries(dimensions)
    .filter(([_, dim]) => dim.score !== null)
    .map(([key, dim]) => ({
      subject: dim.label,
      score: dim.score,
      fullMark: 100,
    }));

  if (data.length < 3) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
        Dados insuficientes para gerar o gráfico (mínimo 3 dimensões ativas)
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickCount={6}
          />
          <Tooltip 
            formatter={(value: number) => [value.toFixed(1), 'Score']}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#1351B4"
            strokeWidth={2}
            fill="#1351B4"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
