/**
 * useContractOwner
 * Reads the owner() from the contract and compares to connected wallet.
 * Used to conditionally show/enable the Admin Minting section.
 *
 * Integration: useReadContract for owner().
 */
import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { ZURU_TOKEN_ABI } from '../abi/ZuruToken';

export interface UseContractOwnerReturn {
  owner: string | undefined;
  isOwner: boolean;
  isLoading: boolean;
}

export function useContractOwner(): UseContractOwnerReturn {
  const { address, isConnected } = useAccount();

  const { data: ownerAddress, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ZURU_TOKEN_ABI,
    functionName: 'owner',
    query: { enabled: isConnected },
  });

  const isOwner =
    isConnected &&
    !!address &&
    !!ownerAddress &&
    address.toLowerCase() === (ownerAddress as string).toLowerCase();

  return {
    owner: ownerAddress as string | undefined,
    isOwner,
    isLoading,
  };
}
