import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { NotificationItem, TxState } from '../types';
import { genId } from '../utils';

// ─── Context Shape ─────────────────────────────────────────────────────────
interface AppContextValue {
  // Active tab navigation
  activeTab: 'claim' | 'mint' | 'transfer';
  setActiveTab: (tab: 'claim' | 'mint' | 'transfer') => void;

  // Global transaction state
  claimTx: TxState;
  setClaimTx: (state: TxState) => void;

  mintTx: TxState;
  setMintTx: (state: TxState) => void;

  transferTx: TxState;
  setTransferTx: (state: TxState) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (n: Omit<NotificationItem, 'id'>) => void;
  removeNotification: (id: string) => void;

  // UI state
  isStatsLoading: boolean;
  setIsStatsLoading: (v: boolean) => void;
}

// ─── Default Values ────────────────────────────────────────────────────────
const defaultTx: TxState = { status: 'idle' };

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<'claim' | 'mint' | 'transfer'>('claim');
  const [claimTx, setClaimTx] = useState<TxState>(defaultTx);
  const [mintTx, setMintTx] = useState<TxState>(defaultTx);
  const [transferTx, setTransferTx] = useState<TxState>(defaultTx);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const addNotification = useCallback((n: Omit<NotificationItem, 'id'>) => {
    const item: NotificationItem = { ...n, id: genId() };
    setNotifications((prev) => [item, ...prev].slice(0, 5));
    // Auto-dismiss after 5s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((x) => x.id !== item.id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value: AppContextValue = {
    activeTab,
    setActiveTab,
    claimTx,
    setClaimTx,
    mintTx,
    setMintTx,
    transferTx,
    setTransferTx,
    notifications,
    addNotification,
    removeNotification,
    isStatsLoading,
    setIsStatsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
