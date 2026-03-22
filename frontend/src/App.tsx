
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter } from './config/wagmi';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { StatsSection } from './components/sections/StatsSection';
import { ClaimSection } from './components/sections/ClaimSection';
import { TransferSection } from './components/sections/TransferSection';
import { MintSection } from './components/sections/MintSection';
import { NotificationContainer } from './components/ui/Notification';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 10_000,
      refetchInterval: 30_000,
    },
  },
});

function FaucetApp() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="orb w-[500px] h-[500px] bg-[#0049e6] top-[-10%] left-[-10%]" />
      <div className="orb w-[400px] h-[400px] bg-[#8539a3] bottom-[-5%] right-[-5%]" />
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <HeroSection />
        <StatsSection />
        <ClaimSection />
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TransferSection />
          <MintSection />
        </section>
      </main>
      <Footer />
      <NotificationContainer />
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <FaucetApp />
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
