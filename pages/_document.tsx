import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0052FF" />
        <meta name="description" content="Coinbase PR Command Center: Real-time PR and social monitoring dashboard for enterprise." />
        <meta name="keywords" content="Coinbase, PR, Dashboard, Social Monitoring, Enterprise, Crypto" />
        <meta name="author" content="Coinbase" />
        <meta name="robots" content="index, follow" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pr-dashboard.coinbase.com/" />
        <meta property="og:title" content="Coinbase PR Command Center" />
        <meta property="og:description" content="Enterprise-grade PR and social monitoring dashboard for Coinbase." />
        <meta property="og:image" content="/icons/og-image.png" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coinbase PR Command Center" />
        <meta name="twitter:description" content="Enterprise-grade PR and social monitoring dashboard for Coinbase." />
        <meta name="twitter:image" content="/icons/og-image.png" />
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
      </Head>
      <body className="bg-[#0a0e1a] text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
