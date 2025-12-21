import { useState } from "react";

export default function OnboardingModal({ onClose }) {
    const [copied, setCopied] = useState(false);
    const [copyFailed, setCopyFailed] = useState(false);

    const homepageUrl = window.location.origin + "/index.html";

    const setHomepage = async () => {
        try {
            await navigator.clipboard.writeText(homepageUrl);
            setCopied(true);
        } catch {
            setCopyFailed(true);
        }

        window.open("about:preferences#home", "_blank");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-black/70 border border-white/20 rounded-3xl p-8 w-[420px] text-white">
                <h1 className="text-2xl font-semibold mb-3">
                    Welcome to BetterHomepage
                </h1>

                <p className="text-white/70 mb-5">
                    This page is already your <b>New Tab</b>.<br />
                    Set it as your <b>Homepage</b> for the best experience.
                </p>

                <button
                    onClick={setHomepage}
                    className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 transition mb-3"
                >
                    Set as Homepage
                </button>

                {copied && (
                    <p className="text-green-400 text-sm mb-3">
                        Homepage URL copied to clipboard ✔
                    </p>
                )}

                {copyFailed && (
                    <p className="text-yellow-400 text-sm mb-2">
                        Clipboard blocked — copy the URL manually:
                    </p>
                )}

                {!copied && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white/70 mb-3 break-all">
                        {homepageUrl}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-2 text-sm text-white/60 hover:text-white"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
}
