

export function HeroSection() {
  return (
    <section className="text-center mb-20 relative">
      <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6 glow-text text-[#2c2f33] animate-fade-in-up stagger-1">
        Zuru{' '}
        <span className="bg-gradient-to-r from-[#0049e6] to-[#8539a3] bg-clip-text text-transparent">
          Faucet
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-[#585c60] text-lg md:text-xl font-body leading-relaxed animate-fade-in-up stagger-2">
        The ultimate token faucet for ZuruToken ecosystem.{' '}
        <span className="block font-semibold text-[#0049e6]">
          Claim 100 ZK tokens every 24 hours.
        </span>
      </p>
    </section>
  );
}
