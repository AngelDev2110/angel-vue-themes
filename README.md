# Angel Front Themes

![CI](https://github.com/AngelDev2110/angel-vue-themes/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/AngelDev2110/angel-vue-themes)

Pick a base color, get a full UI theme — brand palette, semantic status colors, light/dark neutrals, and WCAG-checked contrast — generated algorithmically and previewed live on real components.

## Why OKLCH, not HSL

Most palette generators build on HSL, where equal lightness doesn't mean equal _perceived_ brightness (a 50%-lightness yellow and blue don't look equally bright). That makes generated harmonies look unbalanced and contrast math unreliable.

OKLCH is perceptually uniform: the same numeric change produces the same visual change, regardless of hue. Every conversion (HEX ↔ RGB ↔ OKLCH), harmony, and contrast check here runs on it — a from-scratch implementation (Ottosson's matrices), not a color library.

## Highlights

- **Harmonies over OKLCH** — complementary, analogous, triadic, monochromatic, split-complementary — with hue rotation that stays gamut-safe via binary-search chroma clamping.
- **Status colors, two modes** — fixed (universal green/amber/red/blue) or dynamic (rotates with the base hue, still gamut-clamped per color).
- **Accessible, not just checked** — WCAG 2.x contrast computed per role (formula, spec version, and thresholds documented in-app), keyboard-operable dropdowns, ARIA-labeled controls, two-step confirm on destructive actions.
- **Dual-theme export** — CSS variables, Sass, Tailwind `@theme`, JSON — export the current theme or light + dark together, deduplicated so only the roles that actually differ between modes get duplicated.
- **Per-color fine-tuning** — nudge lightness, chroma, or hue on any generated color; adjustments are gamut-safe deltas, so they survive a base-color or harmony swap and round-trip through saved palettes.
- **Dominant color from an image** — upload a photo and it becomes the base color, via a from-scratch histogram over quantized color buckets (no extraction library).
- **Live preview, not swatches** — navbar, hero, buttons, cards, badges, inputs, alerts, and footer, all wired to the generated theme via CSS variables.

## Stack

![Vue](https://img.shields.io/badge/Vue_3-4FC08D?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?logo=pinia&logoColor=black)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)

Composition API throughout, VueUse for `useLocalStorage`/`useColorMode`, no CSS framework — theming is the point, so it's plain CSS custom properties end to end.

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

## Built in four phases

Color core → real theming (light/dark) → image extraction + fine-tuning → export & polish. Each phase shipped with tests before the next started — see the commit history for the build-out.

## License

MIT — built by [Angel De La Torre](https://www.angeldlt.dev/) · [GitHub](https://github.com/AngelDev2110) · [LinkedIn](https://www.linkedin.com/in/angel-de-la-torre-alcantar/)
