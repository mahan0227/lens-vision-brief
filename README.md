# Lens Vision Brief

Upload or paste a **reference image** (data URL or base64) plus a creative intent → get a **creative direction JSON**: snapshot description, moodboard keywords, palette hints, composition notes, audience read, hooks, and clichés to avoid.

## What it is

A BYOK Next.js app that uses a **vision-capable** OpenAI model (`gpt-4o` / `gpt-4o-mini` recommended) to translate pixels into a brief designers and marketers can execute. Optional `imageMime` helps when pasting **raw base64** that is not PNG.

## Why it’s useful

- Aligns **marketing and design** before expensive shoots or 3D work.
- Extracts **palette and composition** language for decks and handoffs.
- Surfaces **“don’t”** lists early to avoid generic visual tropes.
- Faster than a full creative director cycle for explorations.

## Where you can use it

- **Brand and growth teams** — hero refreshes, paid social concepts, landing experiments.
- **Agencies** — client kickoffs from mood images or competitor stills.
- **Product design** — marketing site visual QA against brand guidelines.
- **Indie games / media** — mood passes for key art direction.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions + vision `image_url` (JSON mode)

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
npm run start
```

## API

`POST /api/vision` · Header `Authorization: Bearer <key>`

Body: `imageDataUrl` (full `data:image/...;base64,...` or raw base64), optional `imageMime` (e.g. `image/jpeg` for raw JPEG base64), optional `briefType`, `model`.

## Suite brochure

[`docs/neuron-suite-brochure.html`](docs/neuron-suite-brochure.html) · [`docs/neuron-suite-ig-square.svg`](docs/neuron-suite-ig-square.svg)

## License

MIT
