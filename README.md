# Palette & Theme Editor

Generate, preview, and export algorithmic color palettes and UI themes. Pick a base color (manually or extracted from an image) and get a harmonious palette applied live to real UI components.

Built on **OKLCH**, a perceptually uniform color space — instead of HSL, which produces unbalanced harmonies and unreliable contrast because equal HSL lightness doesn't mean equal perceived brightness.

## Features

- Custom HEX ↔ RGB ↔ OKLCH conversion (no color library)
- Color harmony generation (complementary, analogous, triadic, monochromatic, split-complementary)
- Live preview on real components (navbar, buttons, cards, inputs, badges)
- Auto-generated light/dark mode from the same palette
- Manual fine-tuning per color (lightness, chroma, hue)
- Dominant color extraction from an image (Canvas API)
- WCAG 2 contrast validation
- Export to CSS variables, JSON, and Tailwind config
- Local palette storage

## Stack

Vue 3 (`<script setup>`) · TypeScript · Vite · Pinia · Vitest · ESLint + Prettier

## Getting started

```sh
bun install
bun dev
```

```sh
bun test:unit   # run tests
bun lint        # lint
```

## License

MIT
