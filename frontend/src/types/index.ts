export interface TokenStats {
  totalSupply: string;
  maxSupply: string;
  claimAmount: string;
  cooldown: number; // seconds
  distributedPercent: number;
}

export interface UserStats {
  balance: string;
  lastClaimed: number; // unix timestamp
  nextClaimAt: number; // unix timestamp
  canClaim: boolean;
  cooldownRemaining: number; // seconds
}

export interface TransferParams {
  recipient: string;
  amount: string;
}

export interface MintParams {
  to: string;
  amount: string;
}

export type TxStatus = 'idle' | 'pending' | 'success' | 'error';

export interface TxState {
  status: TxStatus;
  hash?: string;
  error?: string;
}

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
