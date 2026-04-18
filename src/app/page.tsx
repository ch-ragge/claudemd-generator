"use client";

import { useState } from "react";
import {
  generateClaudeMd,
  type Framework,
  type SecurityLevel,
  type GeneratorConfig,
} from "@/lib/generateClaudeMd";

const ACCENT = "#00B4D8";
const FRAME = "#1A1A2E";

// ────────────────────────────────────────────────
// Primitive UI parts
// ────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full border"
      style={{ color: ACCENT, borderColor: ACCENT }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-6 ${className}`}
      style={{ backgroundColor: FRAME, borderColor: ACCENT + "33" }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-white font-semibold mb-3">{children}</p>;
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
      className="rounded-xl border p-4 text-left transition-all w-full"
      style={{
        backgroundColor: selected ? ACCENT + "22" : "#0A0A0A",
        borderColor: selected ? ACCENT : "#333",
        color: selected ? "#fff" : "#aaa",
      }}
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
      className="rounded-xl border p-3 text-left transition-all"
      style={{
        backgroundColor: checked ? ACCENT + "22" : "#0A0A0A",
        borderColor: checked ? ACCENT : "#333",
        color: checked ? "#fff" : "#aaa",
      }}
    >
      <span className="mr-2">{checked ? "✓" : "○"}</span>
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
      className="px-8 py-3 rounded-xl font-semibold transition-all"
      style={{
        backgroundColor: disabled ? "#333" : ACCENT,
        color: disabled ? "#666" : "#000",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
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
      className="px-6 py-3 rounded-xl font-semibold border transition-all"
      style={{ borderColor: "#444", color: "#aaa" }}
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
          className="h-1 flex-1 rounded-full transition-all"
          style={{ backgroundColor: i < current ? ACCENT : "#333" }}
        />
      ))}
      <span className="text-xs ml-2" style={{ color: ACCENT }}>
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
      <div className="mb-8">
        <Badge>CLAUDE.md Generator</Badge>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
        あなたの CLAUDE.md を<br />
        <span style={{ color: ACCENT }}>今すぐ生成</span>
      </h1>
      <p className="text-slate-400 max-w-lg text-base mb-10 leading-relaxed">
        4 つの質問に答えるだけで、プロジェクトに合った
        セキュリティ規約入りの <code className="text-white bg-slate-800 px-1 rounded">CLAUDE.md</code> が完成します。
        <br />
        外部 API 不使用・データ送信なし・完全ブラウザ完結。
      </p>
      <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm">
        {[
          { icon: "🛡️", label: "セキュリティ規約自動生成" },
          { icon: "⚡", label: "30秒で完成" },
          { icon: "📋", label: "コピー＆ダウンロード" },
        ].map((f) => (
          <div
            key={f.label}
            className="rounded-xl p-4 text-center border"
            style={{ backgroundColor: FRAME, borderColor: ACCENT + "33" }}
          >
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="text-xs text-slate-400">{f.label}</div>
          </div>
        ))}
      </div>
      <PrimaryButton onClick={onStart}>今すぐ生成する →</PrimaryButton>
      <p className="mt-6 text-xs text-slate-600">
        No external API calls · No tracking · No data collection
      </p>
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
      <h2 className="text-2xl font-bold text-white mb-2">プロジェクト情報</h2>
      <p className="text-slate-400 text-sm mb-8">プロジェクト名とフレームワークを選んでください。</p>
      <div className="mb-6">
        <Label>プロジェクト名</Label>
        <input
          type="text"
          value={config.projectName}
          onChange={(e) => onChange("projectName", e.target.value)}
          placeholder="例: my-saas-app"
          className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none border transition-all"
          style={{ backgroundColor: "#0A0A0A", borderColor: "#444" }}
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
      <h2 className="text-2xl font-bold text-white mb-2">技術スタック</h2>
      <p className="text-slate-400 text-sm mb-8">使用する技術を選んでください（複数可・スキップ可）。</p>
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
      <h2 className="text-2xl font-bold text-white mb-2">セキュリティ設定</h2>
      <p className="text-slate-400 text-sm mb-6">レベルと使用機能を選んでください。</p>
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
          className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none border resize-none transition-all"
          style={{ backgroundColor: "#0A0A0A", borderColor: "#444" }}
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
      <h2 className="text-2xl font-bold text-white mb-2">生成完了 🎉</h2>
      <p className="text-slate-400 text-sm mb-6">
        プロジェクトルートに <code className="text-white bg-slate-800 px-1 rounded">CLAUDE.md</code> として保存してください。
      </p>
      <div
        className="rounded-xl border p-4 mb-4 overflow-auto"
        style={{ backgroundColor: "#0A0A0A", borderColor: "#333", maxHeight: "360px" }}
      >
        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
          {output}
        </pre>
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        <PrimaryButton onClick={handleCopy}>
          {copied ? "コピー済み ✓" : "クリップボードにコピー"}
        </PrimaryButton>
        <button
          type="button"
          onClick={handleDownload}
          className="px-6 py-3 rounded-xl font-semibold border transition-all"
          style={{ borderColor: ACCENT, color: ACCENT }}
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
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="w-full max-w-xl">
        {step === 0 ? (
          <StepIntro onStart={() => setStep(1)} />
        ) : (
          <Card>
            <StepBar current={step} total={3} />
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
  );
}
