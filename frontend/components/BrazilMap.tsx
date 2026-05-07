'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StateScore, scoreColor } from '@/lib/api';
import pathsData from '../lib/brazil-map.json';

interface BrazilMapProps {
  states: StateScore[];
}

type MapEntry = { path: string; cx?: number; cy?: number } | string;

export default function BrazilMap({ states }: BrazilMapProps) {
  const router = useRouter();
  const [hoveredState, setHoveredState] = useState<StateScore | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getStateData = (uf: string) => {
    return states.find(s => s.uf === uf) || null;
  };

  const getPath = (entry: MapEntry): string => {
    if (typeof entry === 'string') return entry;
    return entry.path;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" onMouseMove={handleMouseMove}>
      <svg viewBox="0 0 1000 1000" className="w-full h-auto drop-shadow-md">
        {Object.entries(pathsData as Record<string, MapEntry>).map(([uf, entry]) => {
          const stateData = getStateData(uf);
          const color = stateData ? scoreColor(stateData.score_total) : '#e5e7eb';
          
          return (
            <path
              key={uf}
              d={getPath(entry)}
              fill={color}
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-colors duration-200 hover:opacity-80 cursor-pointer"
              onMouseEnter={() => setHoveredState(stateData)}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => {
                if (stateData) {
                  router.push(`/estado/${uf}`);
                }
              }}
            />
          );
        })}
      </svg>

      {hoveredState && (
        <div 
          className="fixed pointer-events-none z-50 bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-48"
          style={{ 
            left: `${mousePos.x + 15}px`, 
            top: `${mousePos.y + 15}px`,
            transform: 'translate(0, 0)'
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-bold text-gray-900">{hoveredState.name}</span>
            <span className="text-xs font-medium px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
              {hoveredState.uf}
            </span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Score Total</span>
            <span className="font-bold" style={{ color: scoreColor(hoveredState.score_total) }}>
              {hoveredState.score_total.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Ranking</span>
            <span className="font-medium text-gray-700">{hoveredState.rank}º lugar</span>
          </div>
        </div>
      )}
    </div>
  );
}
