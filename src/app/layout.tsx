import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const URL_SELF = "https://ch-ragge.github.io/claudemd-generator/";

export const metadata: Metadata = {
  metadataBase: new URL("https://ch-ragge.github.io/claudemd-generator"),
  title: "CLAUDE.md ジェネレーター | 30秒でセキュリティ規約を生成",
  description:
    "4つの質問に答えるだけで、プロジェクトに合ったCLAUDE.mdを自動生成。CLAUDE.mdとは何か・なぜ必要かも解説。外部API不使用・データ送信なし・完全ブラウザ完結。",
  alternates: { canonical: URL_SELF },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: URL_SELF,
    siteName: "らがSE",
    title: "CLAUDE.md ジェネレーター",
    description: "4つの質問に答えるだけでCLAUDE.mdを自動生成する無料ツール。完全ブラウザ完結・データ送信なし。",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CLAUDE.md ジェネレーター",
  url: URL_SELF,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  description: "4つの質問に答えるだけでセキュリティ規約入りのCLAUDE.mdを自動生成する無料ツール。",
  inLanguage: "ja",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable}`}>{children}</body>
    </html>
  );
}
