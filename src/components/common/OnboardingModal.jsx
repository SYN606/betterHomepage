import { useMemo, useState } from "react";
import { FiCheck, FiCopy, FiExternalLink, FiHome, FiX } from "react-icons/fi";

export default function OnboardingModal({ onClose }) {
    const [copied, setCopied] = useState(false);
    const [copyFailed, setCopyFailed] = useState(false);

    const homepageUrl = useMemo(() => {
        if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
            return chrome.runtime.getURL("index.html");
        }
        return `${window.location.origin}/index.html`;
    }, []);

    const copyHomepageUrl = async () => {
        try {
            await navigator.clipboard.writeText(homepageUrl);
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
        >
            <div
                style={{
                    backgroundColor: "rgba(10, 14, 22, 0.65)",
                    borderColor: "var(--glass-border)",
                    backdropFilter: "var(--glass-blur)",
                    boxShadow: "var(--shadow-glass)",
                }}
                className="relative w-full max-w-lg rounded-3xl border-[0.5px] p-6 text-text-primary backdrop-blur-2xl transition-all duration-300"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 rounded-full p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary cursor-pointer"
                    title="Close modal"
                >
                    <FiX size={18} />
                </button>

                {/* Header */}
                <div className="mb-5 flex items-center gap-3.5">
                    <div
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            borderColor: "var(--glass-border)",
                        }}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border-[0.5px] text-primary shadow-sm"
                    >
                        <FiHome size={20} />
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
                            Welcome to BetterHomepage
                        </h1>
                        <p className="text-xs text-text-secondary">
                            Your focus-driven home & start page
                        </p>
                    </div>
                </div>

                {/* Highlight Card */}
                <div
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        borderColor: "var(--glass-border)",
                    }}
                    className="mb-5 rounded-2xl border-[0.5px] p-4"
                >
                    <h2 className="mb-1 text-sm font-medium text-text-primary">
                        Set as Default Homepage
                    </h2>
                    <p className="text-xs leading-relaxed text-text-secondary">
                        Set BetterHomepage as your startup page to enjoy immediate, uninterrupted workflow access every time you open your browser.
                    </p>
                </div>

                {/* Features Checklist */}
                <div className="mb-5 space-y-2 text-xs font-medium text-text-secondary">
                    <div className="flex items-center gap-2.5">
                        <FiCheck className="text-success" size={15} /> Faster access every browser launch
                    </div>
                    <div className="flex items-center gap-2.5">
                        <FiCheck className="text-success" size={15} /> Beautiful, distraction-free environment
                    </div>
                    <div className="flex items-center gap-2.5">
                        <FiCheck className="text-success" size={15} /> Dynamic workspace with custom themes
                    </div>
                </div>

                {/* Guided Steps */}
                <div
                    style={{
                        borderColor: "var(--glass-border)",
                    }}
                    className="mb-4 rounded-2xl border-[0.5px] border-dashed p-3.5 text-xs text-text-secondary"
                >
                    <span className="font-semibold text-text-primary">2-Step Quick Setup:</span>
                    <ol className="mt-1 space-y-1 pl-1">
                        <li>1. Click <strong className="text-text-primary">“Open Settings”</strong> below to copy your URL.</li>
                        <li>2. Paste it into your browser’s Homepage setup field.</li>
                    </ol>
                </div>

                {/* URL Preview Box */}
                <div
                    style={{
                        borderColor: "var(--glass-border)",
                    }}
                    className="mb-4 rounded-xl border-[0.5px] bg-black/30 p-3"
                >
                    <p className="mb-1 text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                        Homepage URL
                    </p>
                    <div
                        style={{ fontFamily: "var(--font-mono)" }}
                        className="break-all text-xs text-text-secondary"
                    >
                        {homepageUrl}
                    </div>
                </div>

                {/* Toast Feedback */}
                {copied && (
                    <p className="mb-3 text-center text-xs font-medium text-success">
                        Homepage URL copied to clipboard! ✔
                    </p>
                )}

                {copyFailed && (
                    <p className="mb-3 text-center text-xs font-medium text-danger">
                        Clipboard blocked — copy the URL manually above.
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2.5 sm:flex-row">
                    <button
                        onClick={openHomepageSettings}
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            borderColor: "var(--glass-border-hover)",
                        }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-[0.5px] px-4 py-2.5 text-xs font-semibold text-text-primary transition-all duration-200 hover:bg-white/15 hover:scale-[1.01] cursor-pointer"
                    >
                        <FiExternalLink size={15} />
                        Open Settings
                    </button>

                    <button
                        onClick={copyHomepageUrl}
                        style={{
                            borderColor: "var(--glass-border)",
                        }}
                        className="flex items-center justify-center gap-2 rounded-2xl border-[0.5px] px-4 py-2.5 text-xs font-medium text-text-secondary transition-all duration-200 hover:bg-white/10 hover:text-text-primary cursor-pointer"
                    >
                        <FiCopy size={15} />
                        Copy URL
                    </button>
                </div>

                {/* Skip Link */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full text-center text-xs text-text-muted transition-colors hover:text-text-primary cursor-pointer"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}