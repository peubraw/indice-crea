import { MetricInput } from '@/lib/api';

export default function SourceCard({ metric }: { metric: MetricInput }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-gov-primary transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs font-semibold text-gov-primary uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
            {metric.dimension}
          </span>
          <h4 className="font-medium text-gray-900 mt-2">{metric.metric_key}</h4>
        </div>
        {metric.is_estimated && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
            Estimado
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Valor Bruto</p>
          <p className="text-lg font-semibold text-gray-900">{metric.raw_value.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Score Normalizado</p>
          <p className="text-lg font-semibold text-gray-900">{metric.normalized_value.toFixed(1)}/100</p>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center text-sm">
        <div className="text-gray-500">
          Fonte:{' '}
          <a 
            href={metric.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gov-primary hover:underline font-medium"
          >
            {metric.source_name}
          </a>
        </div>
        <div className="text-gray-500 text-xs">
          Ref: {metric.reference_period}
        </div>
      </div>
    </div>
  );
}
