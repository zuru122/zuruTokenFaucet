/**
 * useBalanceOf
 * Reads the ZK token balance for the currently connected wallet.
 *
 * Integration: wire up useReadContract from wagmi with balanceOf(address).
 */
import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { ZURU_TOKEN_ABI } from '../abi/ZuruToken';
import { formatTokenFull, formatTokenAmount } from '../utils';

export interface UseBalanceOfReturn {
  balance: string;          // formatted full, e.g. "250"
  balanceShort: string;     // formatted short, e.g. "250 ZK"
  rawBalance: bigint;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export function useBalanceOf(): UseBalanceOfReturn {
  const { address, isConnected } = useAccount();

  const {
    data: rawBalance,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ZURU_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  const bal = rawBalance ?? 0n;
  const balance = formatTokenFull(bal);
  const balanceShort = `${formatTokenAmount(bal)} ZK`;

  return {
    balance,
    balanceShort,
    rawBalance: bal,
    isLoading: isConnected ? isLoading : false,
    isError,
    refetch,
  };
}
