import { ThemeMeta, Theme } from "./loader";

export interface RegistryEntry extends ThemeMeta {
  load: () => Promise<{ default: Theme }>;
}

export const THEME_REGISTRY: Record<string, RegistryEntry> = {
  default: {
    name: "default",
    label: "Default",
    swatches: [
      "oklch(0.2050 0 0)",
      "oklch(1 0 0)",
      "oklch(0.9700 0 0)",
      "oklch(0.9220 0 0)"
    ],
    load: () => import("./configs/default.json"),
  },
  "amber-minimal": {
    name: "amber-minimal",
    label: "Amber Minimal",
    swatches: [
      "oklch(0.7686 0.1647 70.0804)",
      "oklch(1.0000 0 0)",
      "oklch(0.9869 0.0214 95.2774)",
      "oklch(0.2686 0 0)"
    ],
    load: () => import("./configs/amber-minimal.json"),
  },
  "amethyst-haze": {
    name: "amethyst-haze",
    label: "Amethyst Haze",
    swatches: [
      "oklch(0.6104 0.0767 299.7335)",
      "oklch(0.9777 0.0041 301.4256)",
      "oklch(0.7889 0.0802 359.9375)",
      "oklch(0.8447 0.0226 300.1421)"
    ],
    load: () => import("./configs/amethyst-haze.json"),
  },
  bubblegum: {
    name: "bubblegum",
    label: "Bubblegum",
    swatches: [
      "oklch(0.6209 0.1801 348.1385)",
      "oklch(0.9399 0.0203 345.6985)",
      "oklch(0.9195 0.0801 87.6670)",
      "oklch(0.6209 0.1801 348.1385)"
    ],
    load: () => import("./configs/bubblegum.json"),
  },
  caffeine: {
    name: "caffeine",
    label: "Caffeine",
    swatches: [
      "oklch(0.4341 0.0392 41.9938)",
      "oklch(0.9821 0 0)",
      "oklch(0.9310 0 0)",
      "oklch(0.8822 0 0)"
    ],
    load: () => import("./configs/caffeine.json"),
  },
  candyland: {
    name: "candyland",
    label: "Candyland",
    swatches: [
      "oklch(0.8677 0.0735 7.0855)",
      "oklch(0.9809 0.0025 228.7836)",
      "oklch(0.9680 0.2110 109.7692)",
      "oklch(0.8699 0 0)"
    ],
    load: () => import("./configs/candyland.json"),
  },
  "cosmic-night": {
    name: "cosmic-night",
    label: "Cosmic Night",
    swatches: [
      "#a78bfa",
      "#4f46e5",
      "#1e1b4b",
      "#7c3aed"
    ],
    load: () => import("./configs/cosmic-night.json"),
  },
  "rose-pine": {
    name: "rose-pine",
    label: "Rose Pine",
    swatches: [
      "#ebbcba",
      "#c4a7e7",
      "#9ccfd8",
      "#191724"
    ],
    load: () => import("./configs/rose-pine.json"),
  },
  "tokyo-night": {
    name: "tokyo-night",
    label: "Tokyo Night",
    swatches: [
      "#7aa2f7",
      "#bb9af7",
      "#9ece6a",
      "#1a1b2e"
    ],
    load: () => import("./configs/tokyo-night.json"),
  },
  claudeplus: {
    name: "claudeplus",
    label: "Claude +",
    swatches: [
      "oklch(0.6171 0.1375 39.0427)",
      "oklch(0.9818 0.0054 95.0986)",
      "oklch(0.9245 0.0138 92.9892)",
      "oklch(0.8847 0.0069 97.3627)"
    ],
    load: () => import("./configs/claudeplus.json"),
  },
};

/**
 * Derived lightweight catalog array for the theme switcher UI.
 */
export const themesCatalog = Object.values(THEME_REGISTRY).map(
  ({ name, label, swatches }) => ({
    name,
    label,
    swatches,
  })
);
