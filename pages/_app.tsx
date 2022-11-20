import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Provider } from "mobx-react";
import ParentStore from "../stores/ParentStore"

const isServer = typeof window === "undefined";

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  const stores = isServer ? {} : {
    ParentStore
  }

  return (
    <SessionProvider session={pageProps.session}>
      <Provider {...stores}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
