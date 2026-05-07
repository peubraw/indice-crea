'use client';

import { useState } from 'react';
import Link from 'next/link';
import { StateScore, scoreStyle } from '@/lib/api';
import ComingSoonBadge from './ComingSoonBadge';
import { ArrowUpDown } from 'lucide-react';

interface RankingTableProps {
  states: StateScore[];
  highlightUF?: string;
  limit?: number;
}

export default function RankingTable({ states, highlightUF, limit }: RankingTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
    key: 'rank', 
    direction: 'asc' 
  });

  const getDimensionKeys = () => {
    if (!states || states.length === 0) return [];
    return Object.keys(states[0].dimensions);
  };

  const dimensionKeys = getDimensionKeys();

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStates = [...states].sort((a, b) => {
    let valA: any;
    let valB: any;

    if (sortConfig.key === 'rank' || sortConfig.key === 'score_total' || sortConfig.key === 'name') {
      valA = a[sortConfig.key as keyof StateScore];
      valB = b[sortConfig.key as keyof StateScore];
    } else {
      valA = a.dimensions[sortConfig.key]?.score;
      valB = b.dimensions[sortConfig.key]?.score;
    }

    if (valA === null && valB !== null) return 1;
    if (valA !== null && valB === null) return -1;
    if (valA === null && valB === null) return 0;

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const displayStates = limit ? sortedStates.slice(0, limit) : sortedStates;

  const SortIcon = () => <ArrowUpDown size={14} className="inline ml-1 text-gray-400" />;

  const thClass = "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap";

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className={thClass} onClick={() => handleSort('rank')}>
              Pos. {sortConfig.key === 'rank' && <SortIcon />}
            </th>
            <th className={thClass} onClick={() => handleSort('name')}>
              Estado {sortConfig.key === 'name' && <SortIcon />}
            </th>
            <th className={thClass} onClick={() => handleSort('score_total')}>
              Score Total {sortConfig.key === 'score_total' && <SortIcon />}
            </th>
            {dimensionKeys.map(key => (
              <th key={key} className={thClass} onClick={() => handleSort(key)}>
                {states[0]?.dimensions[key]?.label || key} {sortConfig.key === key && <SortIcon />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayStates.map((state, idx) => {
            const isHighlighted = state.uf === highlightUF;
            return (
              <tr 
                key={state.uf} 
                className={`${isHighlighted ? 'bg-blue-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {state.rank}º
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link href={`/estado/${state.uf}`} className="flex items-center gap-2 group">
                    <span className="text-sm font-medium text-gov-primary group-hover:underline">
                      {state.name}
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                      {state.uf}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={scoreStyle(state.score_total)}>
                    {state.score_total.toFixed(1)}
                  </span>
                </td>
                {dimensionKeys.map(key => {
                  const score = state.dimensions[key]?.score;
                  return (
                    <td key={key} className="px-4 py-3 whitespace-nowrap">
                      {score === null ? (
                        <span className="text-gray-400 text-sm">—</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" style={scoreStyle(score)}>
                          {score.toFixed(1)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
