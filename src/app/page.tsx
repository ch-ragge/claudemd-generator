"use client";

import { useState } from "react";
import {
  generateClaudeMd,
  type Framework,
  type SecurityLevel,
  type GeneratorConfig,
} from "@/lib/generateClaudeMd";
import GlassHeader from "@/components/GlassHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

// ────────────────────────────────────────────────
// Primitive UI parts
// ────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border border-accent/40 text-accent">
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-surface p-6 sm:p-10 ${className}`}>{children}</div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-ink font-semibold mb-3">{children}</p>;
}

function RadioCard<T extends string>({
  value,
  current,
  onChange,
  children,
}: {
  value: T;
  current: T;
  onChange: (v: T) => void;
  children: React.ReactNode;
}) {
  const selected = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      aria-pressed={selected}
      className={`rounded-2xl border p-4 text-left transition-colors w-full ${
        selected
          ? "border-accent bg-accent/5 text-ink"
          : "border-black/10 bg-white text-subtle hover:border-black/25"
      }`}
    >
      {children}
    </button>
  );
}

function CheckCard({
  value,
  checked,
  onChange,
  children,
}: {
  value: string;
  checked: boolean;
  onChange: (v: string, checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value, !checked)}
      aria-pressed={checked}
      className={`rounded-2xl border p-3 text-left transition-colors ${
        checked
          ? "border-accent bg-accent/5 text-ink"
          : "border-black/10 bg-white text-subtle hover:border-black/25"
      }`}
    >
      <span className={`mr-2 ${checked ? "text-accent" : ""}`}>{checked ? "✓" : "○"}</span>
      {children}
    </button>
  );
}

function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 rounded-full font-semibold transition-colors ${
        disabled
          ? "bg-black/10 text-subtle cursor-not-allowed"
          : "bg-accent text-night hover:brightness-105 cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-3 rounded-full font-semibold border border-black/15 text-ink transition-colors hover:bg-black/5"
    >
      {children}
    </button>
  );
}

// ────────────────────────────────────────────────
// Step indicator
// ────────────────────────────────────────────────

function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i < current ? "bg-accent" : "bg-black/10"
          }`}
        />
      ))}
      <span className="text-xs ml-2 text-accent">
        {current}/{total}
      </span>
    </div>
  );
}

// ────────────────────────────────────────────────
// Step screens
// ────────────────────────────────────────────────

function StepIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8 hero-item-1">
        <Badge>CLAUDE.md Generator</Badge>
      </div>
      <h1 className="hero-title text-ink mb-6 hero-item-1">
        CLAUDE.mdを、
        <br />
        <span className="text-accent">30秒で。</span>
      </h1>
      <p className="text-subtle max-w-lg mb-12 hero-item-2">
        4 つの質問に答えるだけで、プロジェクトに合った
        セキュリティ規約入りの <code className="text-ink bg-surface border border-black/10 px-1.5 rounded-md">CLAUDE.md</code> が完成します。
        <br />
        外部 API 不使用・データ送信なし・完全ブラウザ完結。
      </p>
      <div className="hero-item-3 flex flex-col items-center w-full">
        <div className="grid grid-cols-3 gap-4 mb-12 w-full max-w-md">
          {[
            { icon: "🛡️", label: "セキュリティ規約自動生成" },
            { icon: "⚡", label: "30秒で完成" },
            { icon: "📋", label: "コピー＆ダウンロード" },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl p-4 text-center bg-surface">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-xs text-subtle">{f.label}</div>
            </div>
          ))}
        </div>
        <PrimaryButton onClick={onStart}>今すぐ生成する →</PrimaryButton>
        <p className="mt-6 text-xs text-subtle">
          No external API calls · No tracking · No data collection
        </p>
      </div>
    </div>
  );
}

function Step1({
  config,
  onChange,
  onNext,
}: {
  config: GeneratorConfig;
  onChange: (k: keyof GeneratorConfig, v: unknown) => void;
  onNext: () => void;
}) {
  const frameworks: { value: Framework; label: string; desc: string }[] = [
    { value: "nextjs", label: "Next.js 15", desc: "App Router / TypeScript" },
    { value: "laravel", label: "Laravel", desc: "PHP / MVC" },
    { value: "wordpress", label: "WordPress", desc: "テーマ / プラグイン開発" },
    { value: "express", label: "Express", desc: "Node.js / REST API" },
    { value: "other", label: "その他", desc: "汎用テンプレート" },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">プロジェクト情報</h2>
      <p className="text-subtle text-sm mb-8">プロジェクト名とフレームワークを選んでください。</p>
      <div className="mb-6">
        <Label>プロジェクト名</Label>
        <input
          type="text"
          value={config.projectName}
          onChange={(e) => onChange("projectName", e.target.value)}
          placeholder="例: my-saas-app"
          className="w-full rounded-2xl px-4 py-3 text-ink text-sm bg-white border border-black/15 transition-colors focus:border-accent"
        />
      </div>
      <div className="mb-8">
        <Label>フレームワーク</Label>
        <div className="grid grid-cols-1 gap-2">
          {frameworks.map((f) => (
            <RadioCard
              key={f.value}
              value={f.value}
              current={config.framework}
              onChange={(v) => onChange("framework", v)}
            >
              <span className="font-semibold">{f.label}</span>
              <span className="text-xs ml-2 opacity-60">{f.desc}</span>
            </RadioCard>
          ))}
        </div>
      </div>
      <PrimaryButton onClick={onNext} disabled={!config.projectName.trim()}>
        次へ →
      </PrimaryButton>
    </div>
  );
}

function Step2({
  config,
  onChange,
  onNext,
  onBack,
}: {
  config: GeneratorConfig;
  onChange: (k: keyof GeneratorConfig, v: unknown) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const TECH = [
    "TypeScript", "Zod", "Prisma", "NextAuth", "Stripe",
    "OpenAI API", "Anthropic API", "PostgreSQL", "MySQL",
    "Redis", "Supabase", "Firebase", "Tailwind CSS",
  ];
  const toggleTech = (v: string, checked: boolean) => {
    const next = checked
      ? [...config.techStack, v]
      : config.techStack.filter((t) => t !== v);
    onChange("techStack", next);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">技術スタック</h2>
      <p className="text-subtle text-sm mb-8">使用する技術を選んでください（複数可・スキップ可）。</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
        {TECH.map((t) => (
          <CheckCard
            key={t}
            value={t}
            checked={config.techStack.includes(t)}
            onChange={toggleTech}
          >
            {t}
          </CheckCard>
        ))}
      </div>
      <div className="flex gap-3">
        <SecondaryButton onClick={onBack}>← 戻る</SecondaryButton>
        <PrimaryButton onClick={onNext}>次へ →</PrimaryButton>
      </div>
    </div>
  );
}

function Step3({
  config,
  onChange,
  onNext,
  onBack,
}: {
  config: GeneratorConfig;
  onChange: (k: keyof GeneratorConfig, v: unknown) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const levels: { value: SecurityLevel; label: string; desc: string }[] = [
    { value: "strict", label: "厳格", desc: "金融・官公庁・個人情報を扱うシステム向け。全ルール適用。" },
    { value: "standard", label: "標準", desc: "一般的な Web アプリ向け。コアルールを適用。" },
    { value: "minimal", label: "軽量", desc: "個人ツール・実験用。基本ルールのみ。" },
  ];
  const options: { key: keyof GeneratorConfig; label: string; desc: string }[] = [
    { key: "hasExternalApi", label: "外部 API を使う", desc: "OpenAI / Anthropic 等" },
    { key: "hasDatabase", label: "DB を使う", desc: "PostgreSQL / MySQL 等" },
    { key: "hasAuth", label: "認証機能がある", desc: "ログイン・セッション管理" },
    { key: "hasPayment", label: "決済機能がある", desc: "Stripe 等" },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">セキュリティ設定</h2>
      <p className="text-subtle text-sm mb-6">レベルと使用機能を選んでください。</p>
      <div className="mb-6">
        <Label>セキュリティレベル</Label>
        <div className="flex flex-col gap-2">
          {levels.map((l) => (
            <RadioCard
              key={l.value}
              value={l.value}
              current={config.securityLevel}
              onChange={(v) => onChange("securityLevel", v)}
            >
              <span className="font-semibold">{l.label}</span>
              <p className="text-xs mt-1 opacity-60">{l.desc}</p>
            </RadioCard>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <Label>使用機能（該当するものを選択）</Label>
        <div className="grid grid-cols-2 gap-2">
          {options.map((o) => (
            <CheckCard
              key={o.key}
              value={o.key}
              checked={config[o.key] as boolean}
              onChange={(_, checked) => onChange(o.key, checked)}
            >
              <span className="font-semibold text-sm">{o.label}</span>
              <p className="text-xs opacity-60">{o.desc}</p>
            </CheckCard>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <Label>追記・特記事項（任意）</Label>
        <textarea
          value={config.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="例: レート制限は 100req/min で実装する"
          rows={3}
          className="w-full rounded-2xl px-4 py-3 text-ink text-sm bg-white border border-black/15 resize-none transition-colors focus:border-accent"
        />
      </div>
      <div className="flex gap-3">
        <SecondaryButton onClick={onBack}>← 戻る</SecondaryButton>
        <PrimaryButton onClick={onNext}>生成する ✓</PrimaryButton>
      </div>
    </div>
  );
}

function StepResult({
  config,
  onBack,
  onReset,
}: {
  config: GeneratorConfig;
  onBack: () => void;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const output = generateClaudeMd(config);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CLAUDE.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">生成完了 🎉</h2>
      <p className="text-subtle text-sm mb-6">
        プロジェクトルートに <code className="text-ink bg-white border border-black/10 px-1.5 rounded-md">CLAUDE.md</code> として保存してください。
      </p>

      {/* macOSターミナル風プレビュー（シグネチャ要素） */}
      <div className="rounded-2xl bg-night overflow-hidden mb-4 shadow-xl">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#28C840]" />
          <span className="ml-3 text-xs text-white/50 font-mono">
            {config.projectName.trim() || "project"} — CLAUDE.md
          </span>
        </div>
        <div className="px-5 py-4 overflow-auto" style={{ maxHeight: "360px" }}>
          <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed text-[#9be8f8]">
            {output}
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <PrimaryButton onClick={handleCopy}>
          {copied ? "コピー済み ✓" : "クリップボードにコピー"}
        </PrimaryButton>
        <button
          type="button"
          onClick={handleDownload}
          className="px-6 py-3 rounded-full font-semibold border border-accent text-accent transition-colors hover:bg-accent/5"
        >
          CLAUDE.md をダウンロード
        </button>
      </div>
      <div className="flex gap-3">
        <SecondaryButton onClick={onBack}>← 設定に戻る</SecondaryButton>
        <SecondaryButton onClick={onReset}>最初からやり直す</SecondaryButton>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────

const DEFAULT_CONFIG: GeneratorConfig = {
  projectName: "",
  framework: "nextjs",
  techStack: [],
  securityLevel: "standard",
  hasExternalApi: false,
  hasDatabase: false,
  hasAuth: false,
  hasPayment: false,
  notes: "",
};

export default function Home() {
  const [step, setStep] = useState(0); // 0=intro, 1-3=steps, 4=result
  const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_CONFIG);

  const update = (k: keyof GeneratorConfig, v: unknown) =>
    setConfig((prev) => ({ ...prev, [k]: v }));

  const reset = () => {
    setConfig(DEFAULT_CONFIG);
    setStep(0);
  };

  return (
    <>
    <GlassHeader current="claudemd" />
    <main className="min-h-screen flex flex-col items-center justify-center bg-base px-4 pt-32 pb-24 sm:pt-36 sm:pb-32">
      <div className="w-full max-w-xl">
        {step === 0 ? (
          <StepIntro onStart={() => setStep(1)} />
        ) : (
          <Card>
            <StepBar current={Math.min(step, 3)} total={3} />
            {step === 1 && (
              <Step1 config={config} onChange={update} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <Step2
                config={config}
                onChange={update}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3
                config={config}
                onChange={update}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <StepResult
                config={config}
                onBack={() => setStep(3)}
                onReset={reset}
              />
            )}
          </Card>
        )}
      </div>
    </main>

    {/* ===== 解説記事セクション（ビルド時HTMLに出力される） ===== */}
    <section className="bg-surface px-6 py-24 sm:py-32">
      <Reveal>
      <article className="max-w-2xl mx-auto text-ink leading-relaxed [&>p]:max-w-[65ch]">
        <h2 className="text-3xl font-bold text-ink mb-6 tracking-tight">
          CLAUDE.md とは何か、なぜ必要なのか
        </h2>

        <p className="mb-8">
          上のジェネレーターは、4つの質問に答えるだけでプロジェクト用の <code className="text-ink bg-white border border-black/10 px-1.5 rounded-md">CLAUDE.md</code> を生成します。
          ここでは、そもそも CLAUDE.md とは何か、なぜセキュリティ規約をそこに書くのか、運用するうえでの注意点を解説します。
        </p>

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">CLAUDE.md とは</h3>
        <p className="mb-4">
          CLAUDE.md は、Claude Code（AnthropicのAIコーディングツール）がプロジェクトで作業するときに、
          最初に読み込む「指示書」にあたるファイルです。プロジェクトのルート（または各ディレクトリ）に置くと、
          AIはその内容を前提として振る舞います。技術スタック・コーディング規約・禁止事項などを書いておくことで、
          毎回同じ説明を繰り返さなくても、AIが一貫したルールで動くようになります。
        </p>

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">なぜセキュリティ規約を CLAUDE.md に書くのか</h3>
        <p className="mb-4">
          AIは指示がなければ「動くコード」を優先しがちで、セキュリティ上望ましくない実装（認証情報のハードコード、
          入力バリデーションの省略など）を提案することがあります。CLAUDE.md にセキュリティ規約を明記しておくと、
          AIが実装前にその制約をチェックし、危険な提案を避けたり、違反しそうなときに確認を求めたりするようになります。
          人間が毎回レビューで弾くより、最初からルールを共有しておくほうが事故が起きにくくなります。
        </p>
        {/* TODO:本人記入 ── CLAUDE.md にセキュリティ規約を書くようになったきっかけ（ヒヤリとした体験など）を書く。最低200字。書き下ろし */}

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">規約項目の解説</h3>
        <p className="mb-4">
          このジェネレーターが出力する規約には、たとえば次のような項目が含まれます。
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><span className="text-ink font-semibold">環境変数の扱い</span>：APIキーや認証情報はコードに直書きせず、環境変数（<code className="text-ink bg-white border border-black/10 px-1.5 rounded-md">.env.local</code> 等）で管理し、コミットしない。</li>
          <li><span className="text-ink font-semibold">入力バリデーション</span>：ユーザー入力はバリデーション（Zod等）を通してから使う。</li>
          <li><span className="text-ink font-semibold">ログ・エラー</span>：ログにPII（個人情報）を出さない。エラーメッセージに内部情報を含めない。</li>
          <li><span className="text-ink font-semibold">外部API</span>：外部通信の追加は事前に確認する。</li>
        </ul>
        <p className="mb-4">
          セキュリティレベル（厳格／標準／軽量）や使用機能（DB・認証・決済など）の選択に応じて、必要な項目が出力に追加されます。
        </p>

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">運用してわかった落とし穴</h3>
        {/* TODO:本人記入 ── CLAUDE.md を実際に運用して気づいた落とし穴（長すぎて読まれない、ルールが形骸化する等）を実体験で書く。最低300字。書き下ろし */}
        <p className="mb-4 text-subtle italic">
          （このセクションは運営者が実体験をもとに執筆予定です）
        </p>

        <h3 className="text-xl font-bold text-ink mt-10 mb-4">まとめ</h3>
        <p className="mb-4">
          CLAUDE.md は、AIに「このプロジェクトではこう振る舞ってほしい」を伝えるための土台です。
          特にセキュリティ規約は、最初に書いておくほど効果があります。まずは上のジェネレーターで雛形を作り、
          自分のプロジェクトに合わせて育てていくのがおすすめです。
        </p>

        <p className="mt-10 text-sm text-subtle">
          関連記事：
          <a
            href="https://ch-ragge.github.io/blog/posts/what-is-claude-md/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-accent hover:opacity-80"
          >
            CLAUDE.mdとは何か【フリーランスSEが3分で解説】
          </a>
        </p>
      </article>
      </Reveal>
    </section>
    <SiteFooter />
    </>
  );
}
