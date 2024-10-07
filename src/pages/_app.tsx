// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { LocalStorageProvider } from '../providers/LocalStorageContext';
import { Theme } from '@radix-ui/themes';
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalStorageProvider>
      <Theme>
        <Component {...pageProps} />
      </Theme>
    </LocalStorageProvider>
  );
}

export default MyApp;