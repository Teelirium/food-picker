import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'datejs';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import 'styles/globals.css';
import { trpc } from 'utils/trpc/client';

import type { AppProps } from 'next/app';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default trpc.withTRPC(MyApp);
