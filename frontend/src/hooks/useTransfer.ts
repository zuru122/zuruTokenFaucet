/**
 * useTransfer
 * Calls transfer(address to, uint256 value) on the ZuruToken contract.
 * Standard ERC-20 transfer from connected wallet to a recipient.
 *
 * Integration: useWriteContract + useWaitForTransactionReceipt from wagmi.
 */
import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import { ZURU_TOKEN_ABI } from '../abi/ZuruToken';
import { useAppContext } from '../context/AppContext';
import { isValidAddress } from '../utils';
import type { TxState, TransferParams } from '../types';

export interface UseTransferReturn {
  transfer: (params: TransferParams) => Promise<void>;
  txState: TxState;
  reset: () => void;
  validate: (params: TransferParams) => string | null;
}

export function useTransfer(): UseTransferReturn {
  const { isConnected } = useAccount();
  const { setTransferTx, addNotification } = useAppContext();
  const [txState, setTxState] = useState<TxState>({ status: 'idle' });

  const { writeContractAsync } = useWriteContract();
  const { isLoading: _isConfirming } = useWaitForTransactionReceipt({
    hash: txState.hash as `0x${string}` | undefined,
    query: { enabled: !!txState.hash },
  });

  const validate = useCallback((params: TransferParams): string | null => {
    if (!params.recipient || !isValidAddress(params.recipient)) return 'Invalid recipient address.';
    const num = parseFloat(params.amount);
    if (!params.amount || isNaN(num) || num <= 0) return 'Amount must be greater than 0.';
    return null;
  }, []);

  const transfer = useCallback(
    async (params: TransferParams) => {
      if (!isConnected) {
        addNotification({ type: 'warning', title: 'Wallet not connected', message: 'Please connect your wallet first.' });
        return;
      }

      const validationError = validate(params);
      if (validationError) {
        addNotification({ type: 'error', title: 'Validation Error', message: validationError });
        return;
      }

      try {
        const pending: TxState = { status: 'pending' };
        setTxState(pending);
        setTransferTx(pending);

        const amountBigInt = parseUnits(params.amount, 18);

        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: ZURU_TOKEN_ABI,
          functionName: 'transfer',
          args: [params.recipient as `0x${string}`, amountBigInt],
        });

        const success: TxState = { status: 'success', hash };
        setTxState(success);
        setTransferTx(success);

        addNotification({
          type: 'success',
          title: 'Transfer Complete!',
          message: `${params.amount} ZK sent to ${params.recipient.slice(0, 8)}...`,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Transfer failed';
        const errState: TxState = { status: 'error', error: message };
        setTxState(errState);
        setTransferTx(errState);
        addNotification({ type: 'error', title: 'Transfer failed', message });
      }
    },
    [isConnected, writeContractAsync, setTransferTx, addNotification, validate]
  );

  const reset = useCallback(() => {
    const idle: TxState = { status: 'idle' };
    setTxState(idle);
    setTransferTx(idle);
  }, [setTransferTx]);

  return { transfer, txState, reset, validate };
}
