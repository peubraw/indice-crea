import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStateByUF, getMetrics, getAllStates } from '@/lib/api';
import ScoreGauge from '@/components/ScoreGauge';
import DimensionRadar from '@/components/DimensionRadar';
import RankingTable from '@/components/RankingTable';
import SourceCard from '@/components/SourceCard';
import ComingSoonBadge from '@/components/ComingSoonBadge';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StatePage({ params }: { params: Promise<{ uf: string }> }) {
  const resolvedParams = await params;
  const uf = resolvedParams.uf.toUpperCase();
  
  try {
    const [stateData, metrics, allStates] = await Promise.all([
      getStateByUF(uf),
      getMetrics(uf),
      getAllStates()
    ]);

    const activeDimensions = Object.entries(stateData.dimensions).filter(([_, d]) => d.score !== null);
    const inactiveDimensions = Object.entries(stateData.dimensions).filter(([_, d]) => d.score === null);

    return (
      <div className="flex flex-col gap-10 pb-16 pt-8 max-w-7xl mx-auto px-4 w-full">
        {/* Breadcrumb */}
        <nav>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gov-primary hover:underline">
            <ArrowLeft size={16} className="mr-1" /> Voltar para o mapa
          </Link>
        </nav>

        {/* State Header */}
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{stateData.name}</h1>
              <span className="bg-gov-secondary text-white px-3 py-1 rounded text-lg font-bold">{stateData.uf}</span>
            </div>
            <p className="text-gray-500 mb-6">
              Ranking Nacional: <strong className="text-gov-primary text-xl">{stateData.rank}º lugar</strong> entre {allStates.length} estados
            </p>
            <div className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-gray-600">
              Ano Base: {stateData.reference_year}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Score Total</h3>
            <ScoreGauge score={stateData.score_total} size="lg" />
          </div>
        </section>

        {/* Analysis Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-gov-primary pl-3">
              Análise por Dimensão
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeDimensions.map(([key, dim]) => (
                <div key={key} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{dim.label}</span>
                  <ScoreGauge score={dim.score} size="sm" showLabel={false} />
                </div>
              ))}
              {inactiveDimensions.map(([key, dim]) => (
                <div key={key} className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex items-center justify-between opacity-75">
                  <span className="font-medium text-gray-700">{dim.label}</span>
                  <ComingSoonBadge />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Perfil Dimensional</h3>
            <DimensionRadar dimensions={stateData.dimensions} />
          </div>
        </section>

        {/* Metrics/Sources */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-gov-primary pl-3">
            Fontes e Dados Brutos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {metrics.map((metric, idx) => (
              <SourceCard key={`${metric.dimension}-${metric.metric_key}-${idx}`} metric={metric} />
            ))}
            {metrics.length === 0 && (
              <p className="text-gray-500 col-span-full">Nenhum dado bruto encontrado para este estado.</p>
            )}
          </div>
        </section>

        {/* Context in Ranking */}
        <section>
          <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-gov-primary pl-3">
              Contexto Nacional
            </h2>
          </div>
          <RankingTable states={allStates} highlightUF={uf} />
        </section>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
