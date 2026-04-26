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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-black/70 p-8 text-white shadow-2xl backdrop-blur-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-white/50 transition hover:text-white"
                    title="Close"
                >
                    <FiX size={20} />
                </button>

                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl">
                        <FiHome size={22} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Welcome to BetterHomepage
                        </h1>
                        <p className="text-sm text-white/60">
                            Your new productivity-focused browser start page
                        </p>
                    </div>
                </div>

                <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h2 className="mb-2 text-lg font-medium">
                        Set this as your Homepage
                    </h2>

                    <p className="text-sm leading-relaxed text-white/70">
                        Your New Tab is already active. Setting BetterHomepage as your
                        Homepage gives you faster access, smoother workflow, and a cleaner
                        browsing experience every day.
                    </p>
                </div>

                <div className="mb-6 grid gap-3 text-sm text-white/80">
                    <div className="flex items-center gap-3">
                        <FiCheck size={16} /> Faster access every launch
                    </div>
                    <div className="flex items-center gap-3">
                        <FiCheck size={16} /> Beautiful focused startup page
                    </div>
                    <div className="flex items-center gap-3">
                        <FiCheck size={16} /> Better workflow and less distraction
                    </div>
                </div>

                <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="mb-3 font-medium">2-Step Guided Setup</h3>

                    <ol className="space-y-2 text-sm text-white/70">
                        <li>1. Click “Open Homepage Settings” below</li>
                        <li>2. Paste the copied URL into Firefox Homepage field</li>
                    </ol>
                </div>

                <div className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/50">
                        Homepage URL
                    </p>

                    <div className="break-all text-sm text-white/80">
                        {homepageUrl}
                    </div>
                </div>

                {copied && (
                    <p className="mb-4 text-sm text-green-400">
                        Homepage URL copied to clipboard ✔
                    </p>
                )}

                {copyFailed && (
                    <p className="mb-4 text-sm text-yellow-300">
                        Clipboard access was blocked — copy the URL manually from above.
                    </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={openHomepageSettings}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 py-3 font-medium transition hover:bg-white/25"
                    >
                        <FiExternalLink size={16} />
                        Open Homepage Settings
                    </button>

                    <button
                        onClick={copyHomepageUrl}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10"
                    >
                        <FiCopy size={16} />
                        Copy URL
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-5 w-full text-sm text-white/55 transition hover:text-white"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
