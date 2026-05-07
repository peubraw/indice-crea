import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gov-secondary text-white py-8 border-t border-gov-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-bold mb-2">CREA-RN</h2>
            <p className="text-sm text-gray-400 max-w-sm text-center md:text-left">
              Conselho Regional de Engenharia e Agronomia do Rio Grande do Norte
            </p>
            <p className="text-xs text-gray-500 mt-1">Sistema CONFEA/CREA</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <Link href="/sobre" className="text-sm text-gray-300 hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/sobre" className="text-sm text-gray-300 hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <a 
              href="https://crea-rn.org.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gov-warning hover:text-white transition-colors"
            >
              crea-rn.org.br
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700 text-center md:text-left">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} CREA-RN. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
