
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { TxStatusBadge } from '../ui/TxStatusBadge';
import { useCooldown } from '../../hooks/useCooldown';
import { useRequestToken } from '../../hooks/useRequestToken';
import { useAccount } from 'wagmi';
import { clsx } from 'clsx';

export function ClaimSection() {
  const { isConnected } = useAccount();
  const { canClaim, countdown, countdownLabel, isLoading: cooldownLoading } = useCooldown();
  const { requestToken, txState, reset } = useRequestToken();

  const isPending = txState.status === 'pending';
  const isSuccess = txState.status === 'success';

  const handleClaim = async () => {
    if (isSuccess) { reset(); return; }
    await requestToken();
  };

  return (
    <section className="max-w-3xl mx-auto mb-16 animate-fade-in-up stagger-3">
      <GlassCard rounded="2xl" padding="xl" className="text-center relative overflow-hidden shadow-[0_20px_40px_rgba(0,73,230,0.06)]">
        {/* Decorative blob */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0049e6]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(130,155,255,0.2)] text-[#0049e6] mb-8 animate-float">
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            water_drop
          </span>
        </div>

        <h2 className="font-headline text-3xl font-bold mb-4 text-[#2c2f33]">
          Request ZK Tokens
        </h2>
        <p className="text-[#585c60] mb-10">
          Verification via connected wallet is required to dispense liquidity.
        </p>

        {/* CTA Button */}
        <Button
          variant={isSuccess ? 'ghost' : 'primary'}
          size="xl"
          loading={isPending}
          disabled={!isConnected || (!canClaim && !isSuccess) || cooldownLoading}
          onClick={handleClaim}
          fullWidth
          className="md:w-auto mx-auto mb-6"
          rightIcon={
            !isPending && (
              <span className="material-symbols-outlined">
                {isSuccess ? 'check_circle' : 'rocket_launch'}
              </span>
            )
          }
        >
          {!isConnected
            ? 'Connect Wallet to Claim'
            : isPending
            ? 'Claiming…'
            : isSuccess
            ? '100 ZK Claimed! Claim Again?'
            : 'Claim 100 ZK'}
        </Button>

        {/* Tx Status */}
        {txState.status !== 'idle' && (
          <div className="mb-6">
            <TxStatusBadge txState={txState} />
          </div>
        )}

        {/* Countdown / next claim label */}
        <div className="flex items-center justify-center gap-2 text-sm font-label font-bold text-[#006574] uppercase tracking-widest">
          <span className="material-symbols-outlined text-sm">timer</span>
          {!isConnected ? (
            <span>Connect wallet to see your cooldown</span>
          ) : cooldownLoading ? (
            <span>Loading cooldown…</span>
          ) : canClaim ? (
            <span className="text-[#0049e6]">Claim available now!</span>
          ) : (
            <span className={clsx(countdown.totalSeconds < 300 && 'text-[#b31b25]')}>
              {countdownLabel}
            </span>
          )}
        </div>
      </GlassCard>
    </section>
  );
}
