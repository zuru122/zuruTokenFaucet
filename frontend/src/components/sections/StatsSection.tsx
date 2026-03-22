
import { StatCard } from '../ui/StatCard';
import { GlassCard } from '../ui/GlassCard';
import { useTotalSupply } from '../../hooks/useTotalSupply';
import { useBalanceOf } from '../../hooks/useBalanceOf';
import { useClaimableAmount } from '../../hooks/useClaimableAmount';
import { useCooldown } from '../../hooks/useCooldown';
import { useAccount } from 'wagmi';

export function StatsSection() {
  const { isConnected } = useAccount();
  const { totalSupply, maxSupply, distributedPercent, isLoading: supplyLoading } = useTotalSupply();
  const { balance, isLoading: balanceLoading } = useBalanceOf();
  const { claimAmount, availableSupply, isLoading: claimLoading } = useClaimableAmount();
  const { countdownLabel, canClaim, isLoading: cooldownLoading } = useCooldown();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {/* Balance */}
      <StatCard
        label="Your Balance"
        value={isConnected ? balance : '—'}
        unit={isConnected ? 'ZK' : undefined}
        isLoading={isConnected && balanceLoading}
        accent="primary"
        className="animate-fade-in-up stagger-3"
      />

      {/* Total Faucet Supply */}
      <GlassCard
        rounded="3xl"
        className="md:col-span-1 lg:col-span-2 relative overflow-hidden animate-fade-in-up stagger-4"
      >
        {/* Decorative inner glow */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#0049e6]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[#585c60] text-xs font-label uppercase tracking-widest font-bold">
              Total Faucet Supply
            </span>
            <span className="text-[#585c60] text-sm font-body">
              {supplyLoading ? '…' : `${distributedPercent.toFixed(1)}% Distributed`}
            </span>
          </div>

          {supplyLoading ? (
            <div className="h-9 w-48 rounded-lg shimmer-loading mb-6" />
          ) : (
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-headline font-black text-[#2c2f33]">
                {totalSupply}
              </span>
              <span className="text-[#585c60] font-medium">/ {maxSupply} ZK</span>
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full h-3 bg-[#dfe3e9] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full shadow-[0_0_10px_rgba(0,73,230,0.3)] transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(distributedPercent, 100)}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Claimable Amount */}
      <StatCard
        label="Claim Amount"
        value={claimLoading ? '…' : claimAmount}
        unit="ZK"
        subValue="per claim"
        isLoading={claimLoading}
        accent="secondary"
        className="animate-fade-in-up stagger-4"
      />

      {/* Available Supply */}
      <StatCard
        label="Available Supply"
        value={claimLoading ? '…' : availableSupply}
        unit="ZK"
        subValue="remaining"
        isLoading={claimLoading}
        accent="tertiary"
        className="animate-fade-in-up stagger-5"
      />

      {/* Cooldown Status — per connected user */}
      <StatCard
        label="Your Cooldown"
        value={
          !isConnected
            ? '—'
            : cooldownLoading
            ? '…'
            : canClaim
            ? 'Ready!'
            : countdownLabel.replace('Retry in ', '')
        }
        subValue={isConnected ? (canClaim ? 'Claim now' : 'Time remaining') : 'Connect wallet'}
        isLoading={isConnected && cooldownLoading}
        accent={canClaim ? 'tertiary' : 'primary'}
        className="animate-fade-in-up stagger-6"
      />
    </section>
  );
}
