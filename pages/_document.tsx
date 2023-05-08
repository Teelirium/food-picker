import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => (
  <Html>
    <Head>
      <link rel="shortcut icon" href="/favicon.svg" />
      <meta name="og:title" content="Food Picker &tm;" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
