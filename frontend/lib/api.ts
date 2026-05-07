export interface StateDimension {
  label: string;
  score: number | null;
}

export interface StateScore {
  uf: string;
  name: string;
  score_total: number;
  rank: number;
  reference_year: number;
  methodology_version: string;
  dimensions: Record<string, StateDimension>;
}

export interface BrazilSummary extends StateScore {
  total_states: number;
}

export interface MetricInput {
  uf: string;
  dimension: string;
  metric_key: string;
  raw_value: number;
  normalized_value: number;
  source_name: string;
  source_url: string;
  reference_period: string;
  is_estimated: boolean;
}

export function scoreColor(score: number | null): string {
  if (score === null) return '#888888'; // Gray for null
  if (score >= 75) return '#168821';
  if (score >= 60) return '#2670E8';
  if (score >= 45) return '#FFCD07';
  if (score >= 30) return '#E52207';
  return '#cc0000';
}

export function scoreLabel(score: number | null): string {
  if (score === null) return 'Em breve';
  if (score >= 75) return 'Excelente';
  if (score >= 60) return 'Bom';
  if (score >= 45) return 'Regular';
  if (score >= 30) return 'Ruim';
  return 'Crítico';
}

export function scoreBgClass(score: number | null): string {
  if (score === null) return 'bg-gray-200 text-gray-700';
  if (score >= 75) return 'bg-score-excelente text-white';
  if (score >= 60) return 'bg-score-bom text-white';
  if (score >= 45) return 'bg-score-regular text-gov-text';
  if (score >= 30) return 'bg-score-ruim text-white';
  return 'bg-score-critico text-white';
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '/crea/api';
  }
  return process.env.BACKEND_URL || 'http://indicecrea-backend:8000';
};

export async function getAllStates(): Promise<StateScore[]> {
  const res = await fetch(`${getBaseUrl()}/states`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch states');
  return res.json();
}

export async function getBrazilSummary(): Promise<BrazilSummary> {
  const res = await fetch(`${getBaseUrl()}/states/brazil`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch Brazil summary');
  return res.json();
}

export async function getStateByUF(uf: string): Promise<StateScore> {
  const res = await fetch(`${getBaseUrl()}/states/${uf}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch state ${uf}`);
  return res.json();
}

export async function getRanking(dimension: string = 'total'): Promise<StateScore[]> {
  const res = await fetch(`${getBaseUrl()}/ranking?dimension=${dimension}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch ranking');
  return res.json();
}

export async function getMetrics(uf: string): Promise<MetricInput[]> {
  const res = await fetch(`${getBaseUrl()}/metrics/${uf}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch metrics for ${uf}`);
  return res.json();
}
