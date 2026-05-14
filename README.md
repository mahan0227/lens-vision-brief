# Lens Vision Brief

Vision-native creative briefing: upload an image (converted client-side to a data URL) and receive structured direction — palette, composition, hooks, and cautions. Uses **your OpenAI API key**.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · OpenAI Chat Completions + vision content

## Run

```bash
npm install
npm run dev
```

Images never touch disk; they are sent as `data:image/...;base64,...` in the JSON body to your own API route, then to OpenAI.

## License

MIT
