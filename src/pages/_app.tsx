// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { LocalStorageProvider } from "../providers/LocalStorageContext";
import { Theme } from "@radix-ui/themes";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { FileAnalysisProvider } from "../providers/FileAnalysisProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalStorageProvider>
      <FileAnalysisProvider>
        <Theme>
          <Component {...pageProps} />
        </Theme>
      </FileAnalysisProvider>
    </LocalStorageProvider>
  );
}

export default MyApp;
