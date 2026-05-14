"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "openai_api_key";
const MODEL_KEY = "openai_model";

export const DEFAULT_MODEL = "gpt-4o-mini";

export function useOpenAISettings() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_MODEL);

  useEffect(() => {
    try {
      const k = localStorage.getItem(STORAGE_KEY);
      const m = localStorage.getItem(MODEL_KEY);
      if (k) setApiKey(k);
      if (m) setModel(m);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (nextKey: string, nextModel: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, nextKey);
      localStorage.setItem(MODEL_KEY, nextModel);
    } catch {
      /* ignore */
    }
  };

  return {
    apiKey,
    setApiKey,
    model,
    setModel,
    persist,
    hasKey: apiKey.trim().length > 0,
  };
}

export type OpenAISettings = ReturnType<typeof useOpenAISettings>;

type ApiKeyBarProps = {
  settings: OpenAISettings;
  accent?: string;
};

export function ApiKeyBar({ settings, accent = "from-violet-500 to-fuchsia-500" }: ApiKeyBarProps) {
  const { apiKey, setApiKey, model, setModel, persist, hasKey } = settings;

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${accent} p-[1px] shadow-lg shadow-black/20`}
    >
      <div className="rounded-2xl bg-zinc-950/90 p-4 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="flex flex-1 flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-200">Your OpenAI API key</span>
            <input
              type="password"
              autoComplete="off"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-600 focus:border-violet-400/60"
            />
            <span className="text-xs text-zinc-500">
              Stored only in this browser. Sent as Bearer on each request; never logged server-side.
            </span>
          </label>
          <label className="flex w-full flex-col gap-1 text-sm md:w-56">
            <span className="font-medium text-zinc-200">Model</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-400/60"
            >
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="gpt-4o">gpt-4o</option>
              <option value="gpt-4.1-mini">gpt-4.1-mini</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => persist(apiKey, model)}
            className="h-10 shrink-0 rounded-xl bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
          >
            Save locally
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Status:{" "}
          <span className={hasKey ? "text-emerald-400" : "text-amber-300"}>
            {hasKey ? "Ready — requests will include your key." : "Add a key to enable AI calls."}
          </span>
        </p>
      </div>
    </section>
  );
}

export function authHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}
