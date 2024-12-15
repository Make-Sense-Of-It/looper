// src/components/MetaHead.tsx
import Head from "next/head";

const MetaHead = () => {
  return (
    <Head>
      <title>Looper: Loop through multiple documents with LLMs</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />

      {/* Primary Meta Tags */}
      <meta
        name="title"
        content="Looper: Loop through multiple documents with LLMs"
      />
      <meta
        name="description"
        content="Analyse multiple documents efficiently with large language models. Looper processes files individually for optimal results in sentiment analysis, categorization, and text extraction."
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.llm-looper.com/" />
      <meta
        property="og:title"
        content="Looper: Loop through multiple documents with LLMs"
      />
      <meta
        property="og:description"
        content="Analyse multiple documents efficiently with large language models. Looper processes files individually for optimal results in sentiment analysis, categorization, and text extraction."
      />
      <meta
        property="og:image"
        content="https://www.llm-looper.com/looper-social.jpg"
      />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://www.llm-looper.com/" />
      <meta
        property="twitter:title"
        content="Looper: Loop through multiple documents with LLMs"
      />
      <meta
        property="twitter:description"
        content="Analyse multiple documents efficiently with large language models. Looper processes files individually for optimal results in sentiment analysis, categorization, and text extraction."
      />
      <meta
        property="twitter:image"
        content="https://www.llm-looper.com/looper-social.jpg"
      />
    </Head>
  );
};

export default MetaHead;
