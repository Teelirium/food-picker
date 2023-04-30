import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'datejs';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import toast, { Toaster, resolveValue } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import Notification from 'components/ui/Notification';
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
    <Toaster position="bottom-right">
      {(t) => (
        <Notification onClick={() => toast.dismiss(t.id)} visible={t.visible} duration={t.duration}>
          {resolveValue(t.message, t)}
        </Notification>
      )}
    </Toaster>
  </QueryClientProvider>
);

export default trpc.withTRPC(MyApp);
