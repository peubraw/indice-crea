import { getAllStates, getBrazilSummary } from '@/lib/api';
import RankingTable from '@/components/RankingTable';
import DimensionRadar from '@/components/DimensionRadar';
import { Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function IndiceNacionalPage() {
  const [states, brazilSummary] = await Promise.all([
    getAllStates(),
    getBrazilSummary()
  ]);

  const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || '/crea/api';
  };

  return (
    <div className="flex flex-col gap-10 pb-16 pt-8 max-w-7xl mx-auto px-4 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Índice Nacional</h1>
          <p className="text-gray-600">Ranking completo de todos os {states.length} estados avaliados.</p>
        </div>
        <a 
          href={`${getBaseUrl()}/metrics/export/csv`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gov-primary text-gov-primary hover:bg-blue-50 font-medium rounded transition-colors shadow-sm"
        >
          <Download size={18} />
          Exportar Dados Brutos (CSV)
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Média Nacional</h3>
          <DimensionRadar dimensions={brazilSummary.dimensions} />
          <div className="mt-6 text-sm text-gray-500 text-center">
            Perfil médio considerando o desempenho de todos os estados do país.
          </div>
        </div>

        <div className="lg:col-span-3">
          <RankingTable states={states} />
        </div>
      </div>
    </div>
  );
}
