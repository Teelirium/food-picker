import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import toast, { Toaster, resolveValue } from 'react-hot-toast';

import Notification from 'components/Notification';
import 'styles/globals.css';
import { trpc } from 'utils/trpc/client';

import type { AppProps } from 'next/app';

const queryClient = new QueryClient();

dayjs.extend(utc);

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
    <ReactQueryDevtools initialIsOpen={false} />
    <Toaster position="bottom-right">
      {(t) => (
        <Notification onClick={() => toast.dismiss(t.id)} {...t}>
          {resolveValue(t.message, t)}
        </Notification>
      )}
    </Toaster>
  </QueryClientProvider>
);

export default trpc.withTRPC(MyApp);
