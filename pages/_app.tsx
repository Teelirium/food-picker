import '../styles/globals.css';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps<{ session: Session }>) => (
  <SessionProvider session={pageProps.session}>
    <Component {...pageProps} />
  </SessionProvider>
);

export default MyApp;
