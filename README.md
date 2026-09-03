# Palette & Theme Editor

Pick a base color, get a full UI theme — brand palette, semantic status colors, light/dark neutrals, and WCAG-checked contrast — generated algorithmically and previewed live on real components.

## Why OKLCH, not HSL

Most palette generators build on HSL, where equal lightness doesn't mean equal _perceived_ brightness (a 50%-lightness yellow and blue don't look equally bright). That makes generated harmonies look unbalanced and contrast math unreliable.

OKLCH is perceptually uniform: the same numeric change produces the same visual change, regardless of hue. Every conversion (HEX ↔ RGB ↔ OKLCH), harmony, and contrast check here runs on it — a from-scratch implementation (Ottosson's matrices), not a color library.

## Highlights

- **Harmonies over OKLCH** — complementary, analogous, triadic, monochromatic, split-complementary — with hue rotation that stays gamut-safe via binary-search chroma clamping.
- **Status colors, two modes** — fixed (universal green/amber/red/blue) or dynamic (rotates with the base hue, still gamut-clamped per color).
- **Real accessibility, not a badge** — WCAG 2.x contrast computed per role, with the formula, spec version, and thresholds documented in-app instead of just asserted.
- **Dual-theme export** — CSS variables, Sass, Tailwind `@theme`, JSON — export the current theme or light + dark together, deduplicated so only the roles that actually differ between modes get duplicated.
- **Per-color fine-tuning** — nudge lightness, chroma, or hue on any generated color; adjustments are gamut-safe deltas, so they survive a base-color or harmony swap and round-trip through saved palettes.
- **Dominant color from an image** — upload a photo and it becomes the base color, via a from-scratch histogram over quantized color buckets (no extraction library).
- **Live preview, not swatches** — navbar, hero, buttons, cards, badges, inputs, alerts, and footer, all wired to the generated theme via CSS variables.

## Stack

Vue 3 (`<script setup>`) · TypeScript · Vite · Pinia · Vitest · ESLint + Prettier · Bun

## Getting started

```sh
bun install
bun run dev
```

```sh
bun run test:unit   # unit tests
bun run type-check  # vue-tsc
bun run lint        # oxlint + eslint
```

## Roadmap

- [x] Core color math (HEX ↔ RGB ↔ OKLCH), harmony generation, live swatch preview
- [x] Full theming — light/dark/auto, real components, semantic + status colors
- [x] Export (CSS/Sass/Tailwind/JSON), local palette saving, WCAG contrast report
- [x] Manual fine-tuning per color (lightness/chroma/hue sliders, gamut-safe)
- [x] Dominant color extraction from an uploaded image

## License

MIT
