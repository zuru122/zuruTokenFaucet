/**
 * useClaimableAmount
 * Reads CLAIM_AMOUNT and available supply to determine how many tokens
 * the faucet can still dispense.
 *
 * Integration: useReadContract for CLAIM_AMOUNT and totalSupply.
 */
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { ZURU_TOKEN_ABI } from '../abi/ZuruToken';
import { formatTokenFull } from '../utils';

const MAX_SUPPLY_RAW = 10_000_000n * 10n ** 18n;

export interface UseClaimableAmountReturn {
  claimAmount: string;       // e.g. "100"
  rawClaimAmount: bigint;
  availableSupply: string;   // tokens still mintable
  rawAvailableSupply: bigint;
  faucetDepleted: boolean;
  isLoading: boolean;
  isError: boolean;
}

export function useClaimableAmount(): UseClaimableAmountReturn {
  const { data: rawClaimAmount, isLoading: loadingClaim, isError: errClaim } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ZURU_TOKEN_ABI,
    functionName: 'CLAIM_AMOUNT',
  });

  const { data: rawTotalSupply, isLoading: loadingSupply, isError: errSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ZURU_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const claimAmt = rawClaimAmount ?? 100n * 10n ** 18n;
  const totalSupply = rawTotalSupply ?? 0n;
  const available = MAX_SUPPLY_RAW > totalSupply ? MAX_SUPPLY_RAW - totalSupply : 0n;

  return {
    claimAmount: formatTokenFull(claimAmt),
    rawClaimAmount: claimAmt,
    availableSupply: formatTokenFull(available),
    rawAvailableSupply: available,
    faucetDepleted: available < claimAmt,
    isLoading: loadingClaim || loadingSupply,
    isError: errClaim || errSupply,
  };
}
