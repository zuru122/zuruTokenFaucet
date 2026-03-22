/**
 * useTotalSupply
 * Reads the current totalSupply() from the ZuruToken contract.
 *
 * Integration: wire up useReadContract from wagmi with CONTRACT_ADDRESS + ZURU_TOKEN_ABI.
 */
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { ZURU_TOKEN_ABI } from '../abi/ZuruToken';
import { formatTokenFull, calcDistributedPercent } from '../utils';

const MAX_SUPPLY_RAW = 10_000_000n * 10n ** 18n;

export interface UseTotalSupplyReturn {
  totalSupply: string;       // formatted, e.g. "4,200,000"
  maxSupply: string;         // formatted, e.g. "10,000,000"
  distributedPercent: number;// 0-100
  rawTotalSupply: bigint;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useTotalSupply(): UseTotalSupplyReturn {
  const {
    data: rawTotalSupply,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ZURU_TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const supply = rawTotalSupply ?? 0n;
  const totalSupply = formatTokenFull(supply);
  const maxSupply = formatTokenFull(MAX_SUPPLY_RAW);
  const distributedPercent = calcDistributedPercent(supply, MAX_SUPPLY_RAW);

  return {
    totalSupply,
    maxSupply,
    distributedPercent,
    rawTotalSupply: supply,
    isLoading,
    isError,
    refetch,
  };
}
