/**
 * useMint
 * Calls mint(address to, uint256 amount) on the ZuruToken contract.
 * Only the contract owner can successfully call this.
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
import type { TxState, MintParams } from '../types';

export interface UseMintReturn {
  mint: (params: MintParams) => Promise<void>;
  txState: TxState;
  reset: () => void;
  validate: (params: MintParams) => string | null;
}

export function useMint(): UseMintReturn {
  const { isConnected } = useAccount();
  const { setMintTx, addNotification } = useAppContext();
  const [txState, setTxState] = useState<TxState>({ status: 'idle' });

  const { writeContractAsync } = useWriteContract();
  const { isLoading: _isConfirming } = useWaitForTransactionReceipt({
    hash: txState.hash as `0x${string}` | undefined,
    query: { enabled: !!txState.hash },
  });

  /** Client-side validation before sending tx */
  const validate = useCallback((params: MintParams): string | null => {
    if (!params.to || !isValidAddress(params.to)) return 'Invalid recipient address.';
    const num = parseFloat(params.amount);
    if (!params.amount || isNaN(num) || num <= 0) return 'Amount must be greater than 0.';
    return null;
  }, []);

  const mint = useCallback(
    async (params: MintParams) => {
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
        setMintTx(pending);

        const amountBigInt = parseUnits(params.amount, 18);

        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: ZURU_TOKEN_ABI,
          functionName: 'mint',
          args: [params.to as `0x${string}`, amountBigInt],
        });

        const success: TxState = { status: 'success', hash };
        setTxState(success);
        setMintTx(success);

        addNotification({
          type: 'success',
          title: 'Tokens Minted!',
          message: `${params.amount} ZK minted to ${params.to.slice(0, 8)}...`,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Mint failed';
        const errState: TxState = { status: 'error', error: message };
        setTxState(errState);
        setMintTx(errState);
        addNotification({ type: 'error', title: 'Mint failed', message });
      }
    },
    [isConnected, writeContractAsync, setMintTx, addNotification, validate]
  );

  const reset = useCallback(() => {
    const idle: TxState = { status: 'idle' };
    setTxState(idle);
    setMintTx(idle);
  }, [setMintTx]);

  return { mint, txState, reset, validate };
}
