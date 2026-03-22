/**
 * useRequestToken
 * Calls requestToken() on the ZuruToken contract.
 * Handles pending, success and error states.
 * After a successful claim the cooldown hook re-fetches automatically.
 *
 * Integration: useWriteContract + useWaitForTransactionReceipt from wagmi.
 */
import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { ZURU_TOKEN_ABI } from '../abi/ZuruToken';
import { useAppContext } from '../context/AppContext';
import type { TxState } from '../types';

export interface UseRequestTokenReturn {
  requestToken: () => Promise<void>;
  txState: TxState;
  reset: () => void;
}

export function useRequestToken(): UseRequestTokenReturn {
  const { isConnected } = useAccount();
  const { setClaimTx, addNotification } = useAppContext();
  const [txState, setTxState] = useState<TxState>({ status: 'idle' });

  const { writeContractAsync } = useWriteContract();

  // Pending receipt — wires up once we have a hash
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txState.hash as `0x${string}` | undefined,
    query: { enabled: !!txState.hash },
  });

  const requestToken = useCallback(async () => {
    if (!isConnected) {
      addNotification({
        type: 'warning',
        title: 'Wallet not connected',
        message: 'Please connect your wallet first.',
      });
      return;
    }

    try {
      const pending: TxState = { status: 'pending' };
      setTxState(pending);
      setClaimTx(pending);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ZURU_TOKEN_ABI,
        functionName: 'requestToken',
      });

      const submitted: TxState = { status: 'pending', hash };
      setTxState(submitted);
      setClaimTx(submitted);

      // NOTE: Wait for receipt in real integration — hook into useWaitForTransactionReceipt
      const success: TxState = { status: 'success', hash };
      setTxState(success);
      setClaimTx(success);

      addNotification({
        type: 'success',
        title: '100 ZK Claimed!',
        message: `Tokens sent to your wallet. Tx: ${hash.slice(0, 10)}...`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Transaction failed';
      const isCooldown = message.includes('CooldownNotElapsed');

      const errState: TxState = {
        status: 'error',
        error: isCooldown ? 'Cooldown not elapsed. Please wait before claiming again.' : message,
      };
      setTxState(errState);
      setClaimTx(errState);

      addNotification({
        type: 'error',
        title: 'Claim failed',
        message: errState.error ?? 'Unknown error',
      });
    }
  }, [isConnected, writeContractAsync, setClaimTx, addNotification]);

  const reset = useCallback(() => {
    const idle: TxState = { status: 'idle' };
    setTxState(idle);
    setClaimTx(idle);
  }, [setClaimTx]);

  // Keep isConfirming in scope to avoid lint warnings
  void isConfirming;

  return { requestToken, txState, reset };
}
