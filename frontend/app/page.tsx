import Link from 'next/link';
import { getAllStates, getBrazilSummary } from '@/lib/api';
import BrazilMap from '@/components/BrazilMap';
import RankingTable from '@/components/RankingTable';
import ComingSoonBadge from '@/components/ComingSoonBadge';
import ScoreGauge from '@/components/ScoreGauge';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [states, brazilSummary] = await Promise.all([
    getAllStates(),
    getBrazilSummary()
  ]);

  const bestState = [...states].sort((a, b) => b.score_total - a.score_total)[0];
  const worstState = [...states].sort((a, b) => a.score_total - b.score_total)[0];

  const dimensions = brazilSummary.dimensions;
  const activeDimensions = Object.entries(dimensions).filter(([_, d]) => d.score !== null);
  const inactiveDimensions = Object.entries(dimensions).filter(([_, d]) => d.score === null);

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero */}
      <section className="bg-gov-secondary text-white pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-gov-accent bg-opacity-20 border border-gov-accent rounded-full text-sm font-medium mb-6">
            Ano Base: {brazilSummary.reference_year} | Metodologia v{brazilSummary.methodology_version}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Painel Nacional de Engenharia,<br className="hidden md:block"/> Agronomia e Geociências
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Uma ferramenta oficial do Sistema CONFEA/CREA para avaliar e monitorar o ecossistema profissional em todos os estados do Brasil.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 w-full -mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 text-center">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">Total Nacional</h3>
            <ScoreGauge score={brazilSummary.score_total} size="md" />
            <p className="mt-4 text-sm text-gray-600">Média de {brazilSummary.total_states} estados</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 text-center">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">Melhor Avaliado</h3>
            <ScoreGauge score={bestState?.score_total || null} size="md" />
            {bestState && (
              <Link href={`/estado/${bestState.uf}`} className="mt-4 inline-block text-sm font-medium text-gov-primary hover:underline">
                {bestState.name} ({bestState.uf})
              </Link>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 text-center">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">Atenção Prioritária</h3>
            <ScoreGauge score={worstState?.score_total || null} size="md" />
            {worstState && (
              <Link href={`/estado/${worstState.uf}`} className="mt-4 inline-block text-sm font-medium text-gov-primary hover:underline">
                {worstState.name} ({worstState.uf})
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Map & Dimensions */}
      <section className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-gov-primary pl-3">
            Mapa de Desempenho
          </h2>
          <p className="text-gray-600 mb-8 text-sm">
            Selecione um estado para ver o detalhamento completo dos indicadores.
          </p>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <BrazilMap states={states} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-gov-primary pl-3">
            Desempenho por Dimensão
          </h2>
          <div className="space-y-4">
            {activeDimensions.map(([key, dim]) => (
              <div key={key} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{dim.label}</h4>
                  <p className="text-sm text-gray-500">Média nacional</p>
                </div>
                <div className="flex items-center gap-4">
                  <ScoreGauge score={dim.score} size="sm" />
                </div>
              </div>
            ))}
            
            {inactiveDimensions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Próximas Dimensões</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inactiveDimensions.map(([key, dim]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-start gap-2">
                      <span className="font-medium text-gray-700">{dim.label}</span>
                      <ComingSoonBadge />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Ranking */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-2">
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-gov-primary pl-3">
            Ranking Nacional (Top 10)
          </h2>
          <Link href="/indice-nacional" className="text-sm font-medium text-gov-primary hover:underline">
            Ver ranking completo &rarr;
          </Link>
        </div>
        <RankingTable states={states} limit={10} />
      </section>
    </div>
  );
}
