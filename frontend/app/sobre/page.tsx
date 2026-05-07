export default function SobrePage() {
  return (
    <div className="flex flex-col gap-10 pb-16 pt-8 max-w-4xl mx-auto px-4 w-full">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sobre o CREA-RN</h1>
        <p className="text-lg text-gray-600">
          Conselho Regional de Engenharia e Agronomia do Rio Grande do Norte
        </p>
      </div>

      <div className="prose prose-blue max-w-none prose-headings:text-gov-secondary prose-a:text-gov-primary bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <h2>Nossa Missão</h2>
        <p>
          O CREA-RN tem como missão atuar na fiscalização, controle, orientação e aprimoramento do exercício e das atividades profissionais nas áreas da Engenharia, Agronomia, Geologia, Geografia e Meteorologia. Nosso foco é assegurar a qualidade dos serviços prestados à sociedade.
        </p>

        <h2>Sistema CONFEA/CREA</h2>
        <p>
          O Conselho Federal de Engenharia e Agronomia (CONFEA) e os Conselhos Regionais (CREAs) formam um sistema integrado responsável pela verificação e fiscalização do exercício profissional em todo o território nacional. Juntos, protegem a sociedade ao garantir que serviços essenciais sejam realizados por profissionais devidamente habilitados.
        </p>

        <h2>O Índice CREA</h2>
        <p>
          Esta plataforma foi desenvolvida como uma iniciativa de inovação tecnológica e transparência. O objetivo não é apenas estabelecer um ranking, mas sim fornecer um diagnóstico claro que permita aos conselhos, governos e instituições educacionais identificar áreas de melhoria e focar investimentos.
        </p>

        <h2>Contato</h2>
        <p>
          Para dúvidas, sugestões ou suporte relacionado ao Índice CREA, entre em contato através de nossos canais oficiais:
        </p>
        <ul>
          <li><strong>Site Institucional:</strong> <a href="https://crea-rn.org.br" target="_blank" rel="noopener noreferrer">crea-rn.org.br</a></li>
          <li><strong>Endereço:</strong> Av. Senador Salgado Filho, 1840 - Lagoa Nova, Natal - RN, 59056-000</li>
        </ul>
      </div>
    </div>
  );
}
