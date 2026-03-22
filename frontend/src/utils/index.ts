import { formatUnits } from 'viem';
import type { CountdownTime } from '../types';

/** Format bigint token amount with 18 decimals to readable string */
export function formatTokenAmount(raw: bigint | undefined, decimals = 18, precision = 2): string {
  if (raw === undefined || raw === null) return '0';
  const formatted = formatUnits(raw, decimals);
  const num = parseFloat(formatted);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(precision)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(precision)}K`;
  return num.toLocaleString(undefined, { maximumFractionDigits: precision });
}

/** Format raw bigint amount with commas for display */
export function formatTokenFull(raw: bigint | undefined, decimals = 18): string {
  if (raw === undefined || raw === null) return '0';
  const formatted = formatUnits(raw, decimals);
  const num = parseFloat(formatted);
  return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

/** Shorten an Ethereum address for display */
export function shortenAddress(address: string | undefined): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Convert a unix timestamp to a countdown object */
export function timestampToCountdown(targetTimestamp: number): CountdownTime {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.max(0, targetTimestamp - now);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { hours, minutes, seconds, totalSeconds: diff };
}

/** Format countdown to human-readable string */
export function formatCountdown(countdown: CountdownTime): string {
  const { hours, minutes, seconds } = countdown;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/** Check if a value is a valid Ethereum address */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/** Parse a decimal token amount string to bigint with 18 decimals */
export function parseTokenAmount(amount: string, decimals = 18): bigint {
  if (!amount || isNaN(parseFloat(amount))) return 0n;
  const [integer, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integer + paddedFraction);
}

/** Calculate percentage distributed */
export function calcDistributedPercent(totalSupply: bigint, maxSupply: bigint): number {
  if (maxSupply === 0n) return 0;
  return Number((totalSupply * 10000n) / maxSupply) / 100;
}

/** Generate unique notification ID */
export function genId(): string {
  return Math.random().toString(36).slice(2, 11);
}

/** Truncate long strings */
export function truncate(str: string, maxLen = 40): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}
