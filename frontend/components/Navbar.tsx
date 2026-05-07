'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Início', href: '/' },
    { name: 'Índice Nacional', href: '/indice-nacional' },
    { name: 'Metodologia', href: '/metodologia' },
    { name: 'Sobre', href: '/sobre' },
  ];

  return (
    <header className="w-full">
      {/* Top Stripe */}
      <div className="h-1 bg-gov-warning w-full" />
      
      {/* Main Navbar */}
      <div className="bg-gov-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight">CREA-RN</span>
                <div className="h-6 w-px bg-gray-500 mx-2" />
                <span className="font-semibold text-lg text-gray-200">Índice CREA</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-gov-warning text-white' 
                        : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center">
              <a 
                href="https://creahub.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-4 px-4 py-2 border border-gov-accent rounded text-sm font-medium text-white hover:bg-gov-accent transition-colors"
              >
                Acesse o CREAHUB
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
