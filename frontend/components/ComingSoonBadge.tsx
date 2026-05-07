'use client';
import { Info } from 'lucide-react';

export default function ComingSoonBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium group relative">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
      Em breve — Fase 2
      <Info size={12} className="text-gray-400 ml-0.5 group-hover:text-gray-600" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg pointer-events-none text-center">
        Dados em fase de coleta e integração para a próxima versão do índice.
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
