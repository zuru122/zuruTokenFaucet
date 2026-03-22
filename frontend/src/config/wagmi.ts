import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { type AppKitNetwork } from '@reown/appkit/networks';

// ─── Project Config ────────────────────────────────────────────────────────
// Replace with your actual WalletConnect / Reown Cloud Project ID
// Get one free at https://cloud.reown.com
export const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? 'YOUR_PROJECT_ID';

// ─── Contract Config ───────────────────────────────────────────────────────
// Replace with the deployed contract address
export const CONTRACT_ADDRESS =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) ??
  '0x0000000000000000000000000000000000000000';

// ─── Supported Networks ────────────────────────────────────────────────────
export const SUPPORTED_NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = [
  sepolia,
  mainnet,
  hardhat,
];

// ─── Wagmi Adapter ─────────────────────────────────────────────────────────
export const wagmiAdapter = new WagmiAdapter({
  networks: SUPPORTED_NETWORKS,
  projectId: WALLETCONNECT_PROJECT_ID,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
  ssr: false,
});

// ─── Wagmi Config (for direct use) ────────────────────────────────────────
export const wagmiConfig = createConfig({
  chains: [sepolia, mainnet, hardhat],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});

// ─── App Metadata ──────────────────────────────────────────────────────────
export const APP_METADATA = {
  name: 'ZuruToken Faucet',
  description: 'The ultimate token faucet for ZuruToken ecosystem. Claim 100 ZK tokens every 24 hours.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://zurutoken.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// ─── Initialize Reown AppKit ───────────────────────────────────────────────
createAppKit({
  adapters: [wagmiAdapter],
  networks: SUPPORTED_NETWORKS,
  projectId: WALLETCONNECT_PROJECT_ID,
  metadata: APP_METADATA,
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#0049e6',
    '--w3m-border-radius-master': '12px',
  },
});
