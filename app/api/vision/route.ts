import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAIApiKey } from "@/lib/openai-key";

const ALLOWED_IMAGE_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]);

function normalizeDataUrl(input: string, mimeHint?: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("data:image")) return trimmed;
  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 40) {
    const b64 = trimmed.replace(/\s+/g, "");
    const hint = mimeHint?.trim().toLowerCase();
    if (hint) {
      const normalized = hint === "image/jpg" ? "image/jpeg" : hint;
      if (ALLOWED_IMAGE_MIME.has(normalized)) {
        return `data:${normalized};base64,${b64}`;
      }
    }
    return `data:image/png;base64,${b64}`;
  }
  return null;
}

export async function POST(request: NextRequest) {
  const apiKey = getOpenAIApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Send Authorization: Bearer <your OpenAI API key> on each request." },
      { status: 401 },
    );
  }

  let body: { imageDataUrl?: string; imageMime?: string; briefType?: string; model?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const dataUrl = normalizeDataUrl(body.imageDataUrl || "", body.imageMime);
  if (!dataUrl) {
    return NextResponse.json(
      {
        error:
          "Provide `imageDataUrl` as a full data URL (data:image/...;base64,...) or raw base64. For raw JPEG/WebP base64, set `imageMime` to e.g. image/jpeg.",
      },
      { status: 400 },
    );
  }

  const client = new OpenAI({ apiKey });
  const model = body.model?.trim() || "gpt-4o-mini";
  const briefType = body.briefType?.trim() || "marketing still / hero visual";

  const system = `You are Lens Vision Brief — a creative director translating visuals into actionable briefs.
Return JSON with:
- snapshot: string (one paragraph visual description)
- moodboard_keywords: string[]
- palette: { name: string; hex?: string }[]
- composition_notes: string[]
- audience_read: string
- campaign_hooks: string[] (3 angles)
- donts: string[] (cliches to avoid)
Context: brief type = ${briefType}`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.45,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this reference image and produce the JSON brief." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ raw: text }, { status: 200 });
    }
    return NextResponse.json({ result: parsed, model });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
