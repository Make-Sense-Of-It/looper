// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { LocalStorageProvider } from "../providers/LocalStorageContext";
import { Theme } from "@radix-ui/themes";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { FileAnalysisProvider } from "../providers/FileAnalysisProvider";
import { FileProcessingProvider } from "../providers/FileProcessingProvider";
import { ConversationProvider } from "../providers/ConversationProvider";
// import { MemoryMonitorProvider } from "../providers/MemoryMonitorProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalStorageProvider>
      <ConversationProvider>
        <FileAnalysisProvider>
          <FileProcessingProvider>
            {/* <MemoryMonitorProvider> */}
              <Theme accentColor="gold">
                <Component {...pageProps} />
              </Theme>
            {/* </MemoryMonitorProvider> */}
          </FileProcessingProvider>
        </FileAnalysisProvider>
      </ConversationProvider>
    </LocalStorageProvider>
  );
}

export default MyApp;
