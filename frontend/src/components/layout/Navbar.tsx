import { useState } from 'react';
import { clsx } from 'clsx';
import { useAppContext } from '../../context/AppContext';

type Tab = 'claim' | 'mint' | 'transfer';

const tabs: { id: Tab; label: string }[] = [
  { id: 'claim', label: 'Claim' },
  { id: 'mint', label: 'Mint' },
  { id: 'transfer', label: 'Transfer' },
];

export function Navbar() {
  const { activeTab, setActiveTab } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/70 backdrop-blur-xl top-0 sticky z-50 shadow-[0_20px_40px_rgba(0,73,230,0.06)]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent font-headline">
          ZuruToken
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'transition-all duration-200 pb-1',
                activeTab === tab.id
                  ? 'text-blue-700 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-500 border-b-2 border-transparent'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Connect Wallet + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Reown AppKit connect button */}
          <appkit-button />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={clsx('block w-5 h-0.5 bg-slate-700 transition-all duration-300', mobileMenuOpen && 'rotate-45 translate-y-2')} />
            <span className={clsx('block w-5 h-0.5 bg-slate-700 transition-all duration-300', mobileMenuOpen && 'opacity-0')} />
            <span className={clsx('block w-5 h-0.5 bg-slate-700 transition-all duration-300', mobileMenuOpen && '-rotate-45 -translate-y-2')} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={clsx(
          'md:hidden overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-48' : 'max-h-0'
        )}
      >
        <div className="px-6 pb-4 flex flex-col gap-2 border-t border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={clsx(
                'text-left py-3 px-4 rounded-xl font-headline font-bold transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
