
import { clsx } from 'clsx';
import type { TxState } from '../../types';

interface TxStatusBadgeProps {
  txState: TxState;
  explorerUrl?: string;
  className?: string;
}

export function TxStatusBadge({ txState, explorerUrl, className }: TxStatusBadgeProps) {
  if (txState.status === 'idle') return null;

  return (
    <div className={clsx('animate-fade-in', className)}>
      {txState.status === 'pending' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#eef1f6] rounded-xl text-xs font-label font-bold text-[#0049e6]">
          <span className="inline-block w-3 h-3 border-2 border-[#0049e6] border-t-transparent rounded-full animate-spin" />
          Confirming transaction…
        </div>
      )}
      {txState.status === 'success' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#eef9f0] rounded-xl text-xs font-label font-bold text-[#1a7a3a]">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {txState.hash ? (
            <a
              href={explorerUrl ? `${explorerUrl}/tx/${txState.hash}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              View on Explorer
            </a>
          ) : (
            'Transaction confirmed!'
          )}
        </div>
      )}
      {txState.status === 'error' && (
        <div className="flex items-start gap-2 px-3 py-2 bg-[#fff5f5] rounded-xl text-xs font-label font-medium text-[#b31b25]">
          <span className="material-symbols-outlined text-sm flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
          <span className="break-words">{txState.error ?? 'Transaction failed.'}</span>
        </div>
      )}
    </div>
  );
}
