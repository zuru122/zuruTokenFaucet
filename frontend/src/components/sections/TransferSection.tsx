import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TxStatusBadge } from '../ui/TxStatusBadge';
import { useTransfer } from '../../hooks/useTransfer';
import { useAccount } from 'wagmi';

export function TransferSection() {
  const { isConnected } = useAccount();
  const { transfer, txState, reset, validate } = useTransfer();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const [amountError, setAmountError] = useState('');

  const isPending = txState.status === 'pending';

  const handleSubmit = async () => {
    // Reset errors
    setRecipientError('');
    setAmountError('');

    const validationErr = validate({ recipient, amount });
    if (validationErr) {
      if (validationErr.toLowerCase().includes('recipient')) setRecipientError(validationErr);
      else setAmountError(validationErr);
      return;
    }

    await transfer({ recipient, amount });

    if (txState.status !== 'error') {
      setRecipient('');
      setAmount('');
      reset();
    }
  };

  return (
    <GlassCard rounded="2xl" className="flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[rgba(0,73,230,0.1)] flex items-center justify-center text-[#0049e6]">
          <span className="material-symbols-outlined">send</span>
        </div>
        <h3 className="font-headline text-2xl font-bold text-[#2c2f33]">Transfer Tokens</h3>
      </div>

      <div className="space-y-6 flex-1">
        <Input
          label="Recipient Address"
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => { setRecipient(e.target.value); setRecipientError(''); }}
          error={recipientError}
          disabled={isPending}
          accent="primary"
        />

        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setAmountError(''); }}
          suffix="ZK"
          error={amountError}
          disabled={isPending}
          accent="primary"
        />

        {txState.status !== 'idle' && (
          <TxStatusBadge txState={txState} />
        )}

        <Button
          variant="outline"
          size="lg"
          fullWidth
          loading={isPending}
          disabled={!isConnected}
          onClick={handleSubmit}
        >
          {!isConnected ? 'Connect Wallet First' : 'Transfer Now'}
        </Button>
      </div>
    </GlassCard>
  );
}
