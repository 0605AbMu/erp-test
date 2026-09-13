import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/query-client.ts';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  </ErrorBoundary>
)
