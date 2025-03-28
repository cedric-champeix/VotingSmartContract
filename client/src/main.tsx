import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { ThemeProvider } from './providers/theme-provider';
import { cookieStorage, createStorage, http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import './lib/i18n';

import { hardhat } from 'viem/chains';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: "275f621740bfee01ee9f2bf973dc15fb",
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <RouterProvider router={router} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </StrictMode>
);
