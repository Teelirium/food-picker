import 'styles/globals.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from 'react-query';

import { trpc } from 'utils/trpc/client';

import type { AppProps } from 'next/app';

const queryClient = new QueryClient();

dayjs.extend(utc);

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  </QueryClientProvider>
);

export default trpc.withTRPC(MyApp);
