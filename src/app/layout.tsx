import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLAUDE.md ジェネレーター | 30秒でセキュリティ規約を生成",
  description:
    "4つの質問に答えるだけで、プロジェクトに合ったCLAUDE.mdを自動生成。外部API不使用・データ送信なし・完全ブラウザ完結。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
