export type Framework = "nextjs" | "laravel" | "wordpress" | "express" | "other";
export type SecurityLevel = "strict" | "standard" | "minimal";

export interface GeneratorConfig {
  projectName: string;
  framework: Framework;
  techStack: string[];
  securityLevel: SecurityLevel;
  hasExternalApi: boolean;
  hasDatabase: boolean;
  hasAuth: boolean;
  hasPayment: boolean;
  notes: string;
}

const frameworkLabel: Record<Framework, string> = {
  nextjs: "Next.js 15 (App Router)",
  laravel: "Laravel",
  wordpress: "WordPress",
  express: "Express / Node.js",
  other: "その他",
};

function securityRules(level: SecurityLevel, cfg: GeneratorConfig): string {
  const core = `
### 環境変数
- 環境変数は \`.env.local\` にのみ記載し、絶対にコミットしない
- \`.env.example\` には変数名のみ記載（実値は空）
- コード内に APIキー・認証情報・シークレットを直書きしない`.trim();

  const strict = `
### 入力バリデーション
- ユーザー入力は必ず **Zod** でバリデーションしてから使用する
- バリデーション前のデータを DB・外部APIに渡さない
- サーバーサイドとクライアントサイドの両方でバリデーションを行う

### ログ・エラー処理
- ログ出力前に PII（メール・トークン・個人情報等）を必ずマスキングする
- エラーメッセージはユーザー向けに詳細を出さない（スタックトレース禁止）
- \`console.log\` にユーザーデータを含めない

### 外部通信
- 外部APIの使用は事前にユーザー承認を得る
- APIキーはサーバーサイドのみで使用し、クライアントに露出させない
- fetch/axiosの呼び出しは必ずタイムアウトを設定する（例: 10秒）`.trim();

  const standard = `
### 入力バリデーション
- ユーザー入力は Zod またはフレームワークのバリデーション機能で検証する
- バリデーション前のデータを DB に渡さない

### ログ・エラー処理
- ログに個人情報（メール・氏名等）を含めない
- エラーメッセージはユーザー向けに詳細を出さない`.trim();

  const minimal = `
### 入力バリデーション
- ユーザー入力は必ず型・形式チェックを行ってから処理する`.trim();

  const parts = [core];
  if (level === "strict") parts.push(strict);
  if (level === "standard") parts.push(standard);
  if (level === "minimal") parts.push(minimal);

  if (cfg.hasAuth) {
    parts.push(`
### 認証・セッション
- パスワードは必ず bcrypt 等でハッシュ化して保存する（平文保存禁止）
- セッショントークンは HttpOnly Cookie に保存する
- CSRF 対策を全フォームに適用する`.trim());
  }

  if (cfg.hasPayment) {
    parts.push(`
### 決済
- カード番号・CVV を自システムの DB に保存しない（PCI DSS 準拠）
- Stripe 等のSDK を使用し、フロントエンドに決済情報を保持させない
- Webhook の署名検証を必ず実装する`.trim());
  }

  if (cfg.hasDatabase) {
    parts.push(`
### データベース
- SQL は必ずパラメータ化クエリ / ORM を使用する（生クエリへの変数埋め込み禁止）
- 本番DBの認証情報は環境変数管理のみ（コード・リポジトリへの記載禁止）`.trim());
  }

  if (cfg.hasExternalApi) {
    parts.push(`
### 外部API
- APIキーはサーバーサイドのみで使用し、クライアントコードに含めない
- レート制限・エラーハンドリングを必ず実装する
- 課金が発生するAPIは利用量上限（バジェットアラート）を設定してから使用する`.trim());
  }

  return parts.join("\n\n");
}

function frameworkRules(framework: Framework): string {
  const rules: Record<Framework, string> = {
    nextjs: `
## Next.js 固有のルール
- Server Actions は必ず入力バリデーションを行う
- \`use client\` コンポーネントにシークレット・APIキーを含めない
- \`/api\` ルートハンドラは入力を検証してから処理する
- \`next.config.ts\` の \`output: 'export'\` を維持する（静的エクスポート前提）
- 画像最適化は \`unoptimized: true\` で対応する`.trim(),

    laravel: `
## Laravel 固有のルール
- Eloquent ORM を使用し、\`DB::raw()\` への変数埋め込みを避ける
- フォームリクエストクラスで入力バリデーションを行う
- CSRF トークンを全 POST フォームに含める
- \`.env\` をリポジトリにコミットしない（\`.env.example\` のみ）
- Sanctum / Passport の設定は公式ドキュメントに従う`.trim(),

    wordpress: `
## WordPress 固有のルール
- 出力時は必ず \`esc_html()\` / \`esc_attr()\` / \`esc_url()\` でエスケープする
- DB クエリは \`$wpdb->prepare()\` を使用する
- nonce を全フォームに実装する
- プラグイン・テーマのアップデートを定期的に行う
- 管理画面URLを変更してデフォルト \`/wp-admin\` を使わない`.trim(),

    express: `
## Express 固有のルール
- \`helmet\` ミドルウェアを必ず使用してセキュリティヘッダーを設定する
- CORS は必要なオリジンのみ許可する（ワイルドカード禁止）
- ユーザー入力は \`express-validator\` または Zod で検証する
- レート制限ミドルウェア（例: \`express-rate-limit\`）を適用する`.trim(),

    other: `
## 共通セキュリティルール
- 使用するフレームワークの公式セキュリティガイドラインに従う
- 依存パッケージは定期的に \`npm audit\` / \`composer audit\` 等で確認する`.trim(),
  };
  return rules[framework];
}

function forbiddenList(cfg: GeneratorConfig): string {
  const items = [
    "APIキー・シークレットをコードに直書きすること",
    ".env ファイルをコミットすること",
    "エラーのスタックトレースをユーザーに表示すること",
    "依存パッケージの脆弱性を放置すること",
  ];
  if (!cfg.hasExternalApi) items.push("事前承認なしに外部APIを使用すること");
  if (!cfg.hasAuth) items.push("ユーザー認証機能を追加すること（セキュリティリスク回避のため）");
  if (!cfg.hasPayment) items.push("決済機能を実装すること（プラットフォーム決済のみ使用）");
  if (cfg.securityLevel === "strict") {
    items.push("console.log にユーザーデータ・個人情報を含めること");
    items.push("未検証のユーザー入力をDBや外部サービスに渡すこと");
  }
  return items.map((i) => `- ${i}`).join("\n");
}

function checkpoints(level: SecurityLevel): string {
  const base = [
    "CP1: 新機能の実装計画を提示してユーザー承認を得る",
    "CP2: 外部サービス・APIを使用する場合は事前に確認する",
    "CP3: DB スキーマを変更する場合はマイグレーション内容を確認する",
    "CP4: 本番環境へのデプロイ前に変更内容をレビューする",
  ];
  if (level === "strict") {
    base.push("CP5: セキュリティ規約に影響する変更はすべてユーザーに確認する");
    base.push("CP6: 新しい依存パッケージの追加は必ず承認を得る");
  }
  return base.map((c) => `- ${c}`).join("\n");
}

export function generateClaudeMd(cfg: GeneratorConfig): string {
  const levelLabel: Record<SecurityLevel, string> = {
    strict: "厳格",
    standard: "標準",
    minimal: "軽量",
  };
  const today = new Date().toISOString().slice(0, 10);

  const techList =
    cfg.techStack.length > 0
      ? cfg.techStack.join(" / ")
      : "指定なし";

  const notesSection = cfg.notes.trim()
    ? `\n## 追記・特記事項\n${cfg.notes.trim()}\n`
    : "";

  return `# CLAUDE.md — ${cfg.projectName || "プロジェクト"}

> 生成日: ${today}
> フレームワーク: ${frameworkLabel[cfg.framework]}
> 技術スタック: ${techList}
> セキュリティレベル: ${levelLabel[cfg.securityLevel]}

このファイルは Claude Code がプロジェクトで作業する際に必ず遵守するルールです。
**違反しようとする実装を検知した場合は、必ずユーザーに確認を求めること。**

---

## セキュリティ規約（必須遵守）

${securityRules(cfg.securityLevel, cfg)}

---

${frameworkRules(cfg.framework)}

---

## 禁止事項

以下は絶対に実施しない:

${forbiddenList(cfg)}

---

## チェックポイント（必ず人間の承認を求める箇所）

${checkpoints(cfg.securityLevel)}

---

## 開発スタイル

- 「実行計画 → 承認待ち → 実装 → 結果報告」のループで進行する
- ファイル作成・コマンド実行は 1 つずつ承認を得る
- エラーが出たら即停止し、推定原因と対応案 3 つを提示する
- 既存ファイルがある場合は確認なしに上書きしない
- 不明点があれば推測で進めず、必ず質問する
${notesSection}
---

*このファイルは [CLAUDE.md ジェネレーター](https://github.com) で生成されました。*
`.trim();
}
