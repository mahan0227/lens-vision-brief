"use client";

import { useState } from "react";
import { ApiKeyBar, authHeaders, useOpenAISettings } from "@/components/ApiKeyBar";

export default function Home() {
  const settings = useOpenAISettings();
  const { apiKey, model, setModel } = settings;
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [briefType, setBriefType] = useState("Product hero on gradient glass background");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function onFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result;
      if (typeof res === "string") setImageDataUrl(res);
    };
    reader.readAsDataURL(file);
  }

  async function run() {
    setError("");
    setOutput("");
    if (!apiKey.trim()) {
      setError("Add your OpenAI API key above.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: authHeaders(apiKey),
        body: JSON.stringify({ imageDataUrl, imageMime, briefType, model }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setOutput(JSON.stringify(data.result ?? data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/90">
          Neuron suite · 06
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Lens Vision Brief
        </h1>
        <p className="max-w-2xl text-lg text-zinc-300">
          Feed a reference image — get palette cues, composition notes, audience read, and sharp
          campaign hooks. Vision models work best with <span className="text-white">gpt-4o</span> or{" "}
          <span className="text-white">gpt-4o-mini</span>.
        </p>
      </header>

      <ApiKeyBar settings={settings} accent="from-sky-400 to-indigo-500" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-200">Image file → data URL</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-zinc-200 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500/20 file:px-3 file:py-2 file:text-sky-100"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-200">Or paste data URL / raw base64</span>
            <textarea
              value={imageDataUrl}
              onChange={(e) => setImageDataUrl(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs outline-none focus:border-sky-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-200">MIME for raw base64 only</span>
            <input
              value={imageMime}
              onChange={(e) => setImageMime(e.target.value)}
              placeholder="image/jpeg"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs outline-none focus:border-sky-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-200">Brief type</span>
            <input
              value={briefType}
              onChange={(e) => setBriefType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-sky-400/60"
            />
          </label>
          <p className="text-xs text-zinc-500">
            Tip: switch model to <button type="button" className="text-sky-300 underline" onClick={() => setModel("gpt-4o")}>gpt-4o</button> for richer visual reads.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={run}
            className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Developing…" : "Generate creative brief"}
          </button>
        </div>
        <div className="flex min-h-[520px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-xs md:text-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Brief JSON</span>
            {error ? <span className="text-rose-400">Error</span> : null}
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <pre className="flex-1 overflow-auto whitespace-pre-wrap text-zinc-100">{output}</pre>
        </div>
      </div>
    </div>
  );
}
