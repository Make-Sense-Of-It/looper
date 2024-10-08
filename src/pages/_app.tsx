// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { LocalStorageProvider } from "../providers/LocalStorageContext";
import { Theme } from "@radix-ui/themes";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { FileAnalysisProvider } from "../providers/FileAnalysisProvider";
import { FileProcessingProvider } from "../providers/FileProcessingProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalStorageProvider>
      <FileAnalysisProvider>
        <FileProcessingProvider>
          <Theme accentColor="gold">
            <Component {...pageProps} />
          </Theme>
        </FileProcessingProvider>
      </FileAnalysisProvider>
    </LocalStorageProvider>
  );
}

export default MyApp;
