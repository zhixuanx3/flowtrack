import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { store } from './store/index';
import { getErrorMessage } from './utils/errors';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => toast.error(getErrorMessage(error)),
  }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
