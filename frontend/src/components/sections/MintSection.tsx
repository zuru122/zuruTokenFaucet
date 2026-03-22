import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TxStatusBadge } from '../ui/TxStatusBadge';
import { useMint } from '../../hooks/useMint';
import { useContractOwner } from '../../hooks/useContractOwner';
import { useAccount } from 'wagmi';
import { clsx } from 'clsx';

export function MintSection() {
  const { isConnected } = useAccount();
  const { isOwner, isLoading: ownerLoading } = useContractOwner();
  const { mint, txState, reset, validate } = useMint();

  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [toError, setToError] = useState('');
  const [amountError, setAmountError] = useState('');

  const isPending = txState.status === 'pending';
  const isLocked = isConnected && !ownerLoading && !isOwner;

  const handleMint = async () => {
    setToError('');
    setAmountError('');

    const validationErr = validate({ to: mintTo, amount: mintAmount });
    if (validationErr) {
      if (validationErr.toLowerCase().includes('recipient')) setToError(validationErr);
      else setAmountError(validationErr);
      return;
    }

    await mint({ to: mintTo, amount: mintAmount });

    if (txState.status !== 'error') {
      setMintTo('');
      setMintAmount('');
      reset();
    }
  };

  return (
    <GlassCard rounded="2xl" className="flex flex-col relative overflow-hidden">
      {/* Admin badge */}
      <div className="absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1 bg-[rgba(251,81,81,0.1)] text-[#9f0519] rounded-full text-[10px] font-label font-bold uppercase tracking-tighter">
        <span className="material-symbols-outlined text-sm">lock</span>
        Admin Only
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[rgba(133,57,163,0.1)] flex items-center justify-center text-[#8539a3]">
          <span className="material-symbols-outlined">token</span>
        </div>
        <h3 className="font-headline text-2xl font-bold text-[#2c2f33]">Owner Minting</h3>
      </div>

      {/* Not owner warning */}
      {isConnected && !ownerLoading && !isOwner && (
        <div className="mb-6 px-4 py-3 bg-[rgba(251,81,81,0.08)] rounded-xl flex items-center gap-2 text-sm text-[#9f0519] font-label font-medium animate-fade-in">
          <span className="material-symbols-outlined text-sm">warning</span>
          Your wallet is not the contract owner. Mint will be rejected.
        </div>
      )}

      <div className={clsx('space-y-6 flex-1', isLocked && 'opacity-60')}>
        <Input
          label="Mint to Address"
          type="text"
          placeholder="0x..."
          value={mintTo}
          onChange={(e) => { setMintTo(e.target.value); setToError(''); }}
          error={toError}
          disabled={isPending || isLocked}
          accent="secondary"
        />

        <Input
          label="Amount"
          type="number"
          placeholder="0"
          value={mintAmount}
          onChange={(e) => { setMintAmount(e.target.value); setAmountError(''); }}
          suffix="ZK"
          error={amountError}
          disabled={isPending || isLocked}
          accent="secondary"
        />

        {txState.status !== 'idle' && (
          <TxStatusBadge txState={txState} />
        )}

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          loading={isPending}
          disabled={!isConnected || isLocked}
          onClick={handleMint}
        >
          {!isConnected
            ? 'Connect Wallet First'
            : ownerLoading
            ? 'Checking permissions…'
            : isLocked
            ? 'Not Authorized'
            : 'Mint Tokens'}
        </Button>
      </div>
    </GlassCard>
  );
}
