import { createSignal, Show } from "solid-js";
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  HomeIcon,
  XIcon,
} from "./Icons";

export default function OnboardingModal(props) {
  const [copied, setCopied] = createSignal(false);
  const [copyFailed, setCopyFailed] = createSignal(false);

  const getHomepageUrl = () => {
    if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
      return chrome.runtime.getURL("index.html");
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}/index.html`;
    }
    return "about:blank";
  };

  const copyHomepageUrl = async () => {
    try {
      await navigator.clipboard.writeText(getHomepageUrl());
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopyFailed(true);
      setCopied(false);
    }
  };

  const openHomepageSettings = async () => {
    await copyHomepageUrl();
    window.open("about:preferences#home", "_blank");
  };

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          "background-color": "rgba(10, 14, 22, 0.65)",
          "border-color": "var(--glass-border)",
          "backdrop-filter": "var(--glass-blur)",
          "box-shadow": "var(--shadow-glass)",
        }}
        class="relative w-full max-w-lg rounded-3xl border-[0.5px] p-6 text-text-primary backdrop-blur-2xl transition-all duration-300"
      >
        {/* Close Button */}
        <button
          onClick={() => props.onClose?.()}
          class="absolute right-5 top-5 rounded-full p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary cursor-pointer"
          title="Close modal"
        >
          <XIcon class="w-4.5 h-4.5" />
        </button>

        {/* Header */}
        <div class="mb-5 flex items-center gap-3.5">
          <div
            style={{
              "background-color": "rgba(255, 255, 255, 0.03)",
              "border-color": "var(--glass-border)",
            }}
            class="flex h-11 w-11 items-center justify-center rounded-2xl border-[0.5px] text-primary shadow-sm"
          >
            <HomeIcon class="w-5 h-5" />
          </div>

          <div>
            <h1 class="text-lg font-semibold tracking-tight text-text-primary">
              Welcome to BetterHomepage
            </h1>
            <p class="text-xs text-text-secondary">
              Your focus-driven home & start page
            </p>
          </div>
        </div>

        {/* Highlight Card */}
        <div
          style={{
            "background-color": "rgba(255, 255, 255, 0.02)",
            "border-color": "var(--glass-border)",
          }}
          class="mb-5 rounded-2xl border-[0.5px] p-4"
        >
          <h2 class="mb-1 text-sm font-medium text-text-primary">
            Set as Default Homepage
          </h2>
          <p class="text-xs leading-relaxed text-text-secondary">
            Set BetterHomepage as your startup page to enjoy immediate,
            uninterrupted workflow access every time you open your browser.
          </p>
        </div>

        {/* Features Checklist */}
        <div class="mb-5 space-y-2 text-xs font-medium text-text-secondary">
          <div class="flex items-center gap-2.5">
            <CheckIcon class="w-4 h-4 text-success" /> Faster access every browser launch
          </div>
          <div class="flex items-center gap-2.5">
            <CheckIcon class="w-4 h-4 text-success" /> Beautiful, distraction-free environment
          </div>
          <div class="flex items-center gap-2.5">
            <CheckIcon class="w-4 h-4 text-success" /> Dynamic workspace with custom themes
          </div>
        </div>

        {/* Guided Steps */}
        <div
          style={{
            "border-color": "var(--glass-border)",
          }}
          class="mb-4 rounded-2xl border-[0.5px] border-dashed p-3.5 text-xs text-text-secondary"
        >
          <span class="font-semibold text-text-primary">2-Step Quick Setup:</span>
          <ol class="mt-1 space-y-1 pl-1">
            <li>
              1. Click <strong class="text-text-primary">“Open Settings”</strong> below to copy your URL.
            </li>
            <li>2. Paste it into your browser’s Homepage setup field.</li>
          </ol>
        </div>

        {/* URL Preview Box */}
        <div
          style={{
            "border-color": "var(--glass-border)",
          }}
          class="mb-4 rounded-xl border-[0.5px] bg-black/30 p-3"
        >
          <p class="mb-1 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
            Homepage URL
          </p>
          <div
            style={{ "font-family": "var(--font-mono)" }}
            class="break-all text-xs text-text-secondary"
          >
            {getHomepageUrl()}
          </div>
        </div>

        {/* Toast Feedback */}
        <Show when={copied()}>
          <p class="mb-3 text-center text-xs font-medium text-success">
            Homepage URL copied to clipboard! ✔
          </p>
        </Show>

        <Show when={copyFailed()}>
          <p class="mb-3 text-center text-xs font-medium text-danger">
            Clipboard blocked — copy the URL manually above.
          </p>
        </Show>

        {/* Action Buttons */}
        <div class="flex flex-col gap-2.5 sm:flex-row">
          <button
            onClick={openHomepageSettings}
            style={{
              "background-color": "rgba(255, 255, 255, 0.08)",
              "border-color": "var(--glass-border-hover)",
            }}
            class="flex flex-1 items-center justify-center gap-2 rounded-2xl border-[0.5px] px-4 py-2.5 text-xs font-semibold text-text-primary transition-all duration-200 hover:bg-white/15 hover:scale-[1.01] cursor-pointer"
          >
            <ExternalLinkIcon class="w-4 h-4" />
            Open Settings
          </button>

          <button
            onClick={copyHomepageUrl}
            style={{
              "border-color": "var(--glass-border)",
            }}
            class="flex items-center justify-center gap-2 rounded-2xl border-[0.5px] px-4 py-2.5 text-xs font-medium text-text-secondary transition-all duration-200 hover:bg-white/10 hover:text-text-primary cursor-pointer"
          >
            <CopyIcon class="w-4 h-4" />
            Copy URL
          </button>
        </div>

        {/* Skip Link */}
        <button
          onClick={() => props.onClose?.()}
          class="mt-4 w-full text-center text-xs text-text-muted transition-colors hover:text-text-primary cursor-pointer"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}