import type { NextRequest } from "next/server";

export function getOpenAIApiKey(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    const key = auth.slice(7).trim();
    return key.length ? key : null;
  }
  const headerKey = request.headers.get("x-openai-api-key")?.trim();
  if (headerKey?.length) return headerKey;
  return null;
}
