# side-business-template

副業・個人開発用の Next.js 共通テンプレートです。

## 技術スタック

- Next.js 15 (App Router / TypeScript / 静的エクスポート)
- Tailwind CSS v4
- ESLint + Prettier
- GitHub Actions (npm audit + gitleaks)

## セットアップ手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/YOUR_NAME/side-business-template.git
cd side-business-template

# 2. 環境変数ファイルを作成
cp .env.example .env.local
# .env.local を編集して必要な値を入力

# 3. 依存パッケージをインストール
npm install

# 4. 開発サーバーを起動
npm run dev
# http://localhost:3000 で確認
```

## このテンプレートから新規プロジェクトを派生させる手順

1. GitHub でこのリポジトリを **Fork** または **Use this template**
2. リポジトリ名を新プロジェクト名に変更
3. `package.json` の `name` を更新
4. `src/app/page.tsx` を新しいランディングページに書き換え
5. 必要な依存パッケージを追加

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 静的サイト生成 (`out/`) |
| `npm run lint` | ESLint 実行 |
| `npm run format` | Prettier 自動修正 |
| `npm run format:check` | Prettier チェックのみ |

## セキュリティ規約

詳細は [CLAUDE.md](./CLAUDE.md) を参照してください。

## 免責事項

本テンプレートは現状有姿（AS IS）で提供されます。作者は本テンプレートの使用によって生じたいかなる損害についても責任を負いません。商用・非商用を問わず自由に使用できますが、無保証です。
