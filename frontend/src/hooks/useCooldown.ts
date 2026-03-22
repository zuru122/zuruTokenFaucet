/**
 * useCooldown
 * Reads lastClaimed for the connected user and calculates:
 * - whether they can claim now
 * - the exact countdown until next claim
 * This is user-specific; each wallet has its own cooldown state.
 *
 * Integration: wire up useReadContract for lastClaimed(address).
 */
import { useState, useEffect } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { ZURU_TOKEN_ABI } from '../abi/ZuruToken';
import { timestampToCountdown, formatCountdown } from '../utils';
import type { CountdownTime } from '../types';

const COOLDOWN_SECONDS = 24 * 60 * 60; // 24 hours

export interface UseCooldownReturn {
  canClaim: boolean;
  countdown: CountdownTime;
  countdownLabel: string; // e.g. "11h 12m 15s"
  nextClaimAt: number;    // unix timestamp
  lastClaimed: number;    // unix timestamp (0 if never)
  isLoading: boolean;
  refetch: () => void;
}

export function useCooldown(): UseCooldownReturn {
  const { address, isConnected } = useAccount();
  const [countdown, setCountdown] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  const {
    data: lastClaimedRaw,
    isLoading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ZURU_TOKEN_ABI,
    functionName: 'lastClaimed',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  const lastClaimedTs = lastClaimedRaw ? Number(lastClaimedRaw) : 0;
  const nextClaimAt = lastClaimedTs === 0 ? 0 : lastClaimedTs + COOLDOWN_SECONDS;
  const canClaim =
    !isConnected ? false : lastClaimedTs === 0 || Math.floor(Date.now() / 1000) >= nextClaimAt;

  // Live countdown ticker — runs only for the connected user
  useEffect(() => {
    if (!isConnected || canClaim || nextClaimAt === 0) {
      setCountdown({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
      return;
    }

    const tick = () => setCountdown(timestampToCountdown(nextClaimAt));
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isConnected, canClaim, nextClaimAt]);

  return {
    canClaim,
    countdown,
    countdownLabel: canClaim ? 'Claim available!' : `Retry in ${formatCountdown(countdown)}`,
    nextClaimAt,
    lastClaimed: lastClaimedTs,
    isLoading: isConnected ? isLoading : false,
    refetch,
  };
}
