export default function MetodologiaPage() {
  return (
    <div className="flex flex-col gap-10 pb-16 pt-8 max-w-4xl mx-auto px-4 w-full">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Metodologia</h1>
        <p className="text-lg text-gray-600">
          Entenda como o Índice CREA é calculado e quais dados compõem nossa avaliação.
        </p>
      </div>

      <div className="prose prose-blue max-w-none prose-headings:text-gov-secondary prose-a:text-gov-primary bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <h2>O que é o Índice CREA?</h2>
        <p>
          O Índice CREA é uma ferramenta oficial desenvolvida para mensurar a maturidade e a força do ecossistema de Engenharia, Agronomia e Geociências nos estados brasileiros. O objetivo é fornecer dados transparentes para apoiar políticas públicas, investimentos e o desenvolvimento profissional.
        </p>

        <h2>Dimensões Avaliadas</h2>
        <p>A avaliação é dividida em dimensões estruturais (Fase 1 e Fase 2):</p>
        
        <h3>Fase 1 (Ativa)</h3>
        <ul>
          <li><strong>Mercado Profissional:</strong> Analisa a proporção de profissionais ativos em relação à população e PIB do estado.</li>
          <li><strong>Formação Técnica:</strong> Avalia a qualidade e quantidade de cursos e instituições de ensino superior registradas.</li>
          <li><strong>Capacidade Técnica:</strong> Mede o volume e a complexidade das ARTs (Anotações de Responsabilidade Técnica) emitidas.</li>
        </ul>

        <h3>Fase 2 (Em Desenvolvimento)</h3>
        <ul>
          <li><strong>Obras e Projetos:</strong> Foco em grandes obras de infraestrutura e projetos inovadores.</li>
          <li><strong>Empregabilidade:</strong> Dados do CAGED sobre contratação formal e faixas salariais.</li>
          <li><strong>Fiscalização:</strong> Eficiência das ações fiscalizatórias dos conselhos regionais.</li>
        </ul>

        <h2>Cálculo do Score</h2>
        <p>
          O cálculo utiliza o método de <strong>Min-Max Normalization</strong>. Cada métrica bruta é convertida para uma escala de 0 a 100, onde 100 representa o melhor desempenho nacional na métrica específica e 0 o pior.
        </p>
        <p>A fórmula base é:</p>
        <pre className="bg-gray-50 p-4 rounded text-sm text-gray-800 font-mono overflow-x-auto border border-gray-200">
          Score = ((Valor - Min) / (Max - Min)) * 100
        </pre>
        <p>
          As dimensões são calculadas através da média ponderada de seus indicadores internos. O Score Total do estado é a média aritmética das pontuações das dimensões ativas.
        </p>

        <h2>Transparência e Atualização</h2>
        <p>
          Os dados são coletados anualmente e auditados. O Índice CREA tem o compromisso de disponibilizar as fontes primárias (links e referências) de todos os dados brutos utilizados no cálculo.
        </p>
      </div>
    </div>
  );
}
