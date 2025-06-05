import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "./basic-styles.css";
import "./fonts.css";
import "./hide-debug.css";
import { Providers } from "./providers";
import "./hide-debug.js";
import { siteConfig } from "../config/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: siteConfig.name + " | Pinturas y revestimientos de alta calidad",
  description: siteConfig.description,
  keywords: siteConfig.keywords.join(", "),
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: siteConfig.openGraph.locale,
    url: siteConfig.url,
    title: siteConfig.name + " | Pinturas y revestimientos de alta calidad",
    description: siteConfig.description,
    siteName: siteConfig.openGraph.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name + " - Pinturas y revestimientos de alta calidad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.twitter.title,
    description: siteConfig.twitter.description,
    creator: siteConfig.twitter.creator,
    images: siteConfig.twitter.images,
  },
  icons: siteConfig.icons,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/rcv4ocf.css" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <Providers>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
