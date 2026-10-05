import type { Metadata, Viewport } from "next";
import {
  EB_Garamond,
  Fondamento,
  Noto_Serif_Armenian,
} from "next/font/google";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

// the face on the soap boxes, for the logo, headings and bar names
const fondamento = Fondamento({
  variable: "--font-fondamento",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// for everything you read
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

// only for the word օճառ. not preloaded, so it's only fetched where it shows
const armenian = Noto_Serif_Armenian({
  variable: "--font-noto-armenian",
  subsets: ["armenian"],
  weight: "400",
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "ochar · homemade, all-natural soap",
    template: "%s · ochar",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: "ochar",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f0e6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fondamento.variable} ${garamond.variable} ${armenian.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
