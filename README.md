# Next Switchcn 🎨

A state-of-the-art dynamic runtime theme switching system built for Next.js 15/16 and React 19. Engineered for visually stunning aesthetics, smooth animations, and **absolute zero hydration errors**.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Preview-6366f1?style=for-the-badge&logo=next.js&logoColor=white)](https://switchcn.softono.com)
[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)

---

## 🛠️ Getting Started

### 1. Quick Installation (Recommended)

You can automatically install and configure all necessary SwitchCN files and themes directly into your existing React or Next.js project using our dedicated installer CLI:

```bash
npx add-switchcn
```

This will automatically:
- Detect your framework and package manager.
- Verify that Tailwind CSS v4 is configured.
- Resolve the appropriate installation path (`src/components/switchcn` or `components/switchcn`).
- Fetch the SwitchCN registry and download the core files, utilities, and curated themes.
- Install any necessary dependencies using your active package manager (`npm`, `pnpm`, `yarn`, or `bun`).

### 2. Manual Clone & Setup (Alternative)

If you'd rather run the demo project locally first, clone this repository and install the dependencies:

```bash
git clone https://github.com/softono/switchcn.git
cd switchcn
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### 4. Production Build

Build and optimize the production bundle:

```bash
npm run build
npm run start
```

---

## 📦 Integration & Usage Guide

Follow these simple steps to integrate Switchcn into your Next.js application with zero hydration errors and seamless server-side rendering:

### 1. Configure the Root Layout (`src/app/layout.tsx`)

To enable instant theme rendering on the server, eliminate flash of unstyled content (FOUC), and prevent React hydration mismatches:
- Call `getColorMode()` in your asynchronous `RootLayout` server component to read preferred theme colors from cookies.
- Inject `applyThemeScript` in a `<script>` tag inside `<head>` to execute immediately before hydration.
- Wrap your page components with the `<ThemeProvider>`.

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider, applyThemeScript } from "@/components/switchcn";
import { getColorMode } from "@/components/switchcn/color-mode-server";

export const metadata: Metadata = {
  title: "Theme Switcher — shadcn/ui Demo",
  description: "A Next.js demo with a runtime tweakcn-style theme switcher and shadcn/ui components.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Resolve preferred color mode on the server via cookies
  const htmlClass = await getColorMode();

  return (
    <html lang="en" className={htmlClass}>
      <head>
        {/* 2. Apply theme preference immediately before hydration to prevent visual flashing */}
        <script dangerouslySetInnerHTML={{ __html: applyThemeScript }} />
      </head>
      <body>
        {/* 3. Wrap application content in the ThemeProvider */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Render the Theme Switcher (`src/app/page.tsx`)

Import and render `<ThemeSwitcher />` anywhere inside your Client Components (such as headers, navigation bars, or setting panels):

```tsx
"use client";

import { ThemeSwitcher } from "@/components/switchcn";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 h-12 max-w-[1150px] mx-auto">
        <span className="text-sm font-semibold">My Application</span>
        
        {/* Render the switcher trigger */}
        <ThemeSwitcher size="large" />
      </div>
    </nav>
  );
}
```

### Component Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `size` | `"small" \| "large"` | `"large"` | Determines the visual display variant of the trigger button. `small` displays an icon-only paint palette trigger; `large` displays the full information trigger. |

---


## 🌟 Key Features

*   🚫 **Zero-Hydration-Error Architecture**: Built to perfectly sync client and server theme classes. Avoids using cheap tricks like `suppressHydrationWarning` by resolving preferred theme and color-mode through server cookie parsing.
*   🎨 **10 Curated Premium Themes**: Hand-crafted themes out of the box with gorgeous palettes:
    *   **Default**: Sleek high-contrast dark/light mode.
    *   **Amber Minimal**: Warm amber accents for minimalist layouts.
    *   **Amethyst Haze**: Luxurious purple hues with Geist, Lora, and Fira Code fonts.
    *   **Bubblegum**: Sweet, bright bubblegum pinks and pastel vibes.
    *   **Caffeine**: Deep, rich warm coffee tones.
    *   **Candyland**: Fun, vibrant candy palette with Roboto Mono.
    *   **Cosmic Night**: Moody interstellar deep purples and indigos.
    *   **Rose Pine**: The cozy, minimalist developer-favorite palette.
    *   **Tokyo Night**: High-energy cyberpunk neon aesthetic.
    *   **Claude+**: Sleek and professional golden-clay aesthetic.
*   📐 **Dual Trigger Sizes**:
    *   `large` (Default): Shows live color swatches, active theme title, current scheme toggle icon, and a dropdown chevron.
    *   `small`: Compact, rounded trigger button (`36px x 36px`) rendering a beautiful SVG paint-palette icon. Dropdown aligns flush right—ideal for dense navigation bars and headers.
*   🔍 **Instant Filter Search**: Fast, responsive type-to-filter theme searching integrated directly in the dropdown panel.
*   🔀 **Theme Actions**: Includes cycling color-modes (Light, Dark, System) and a dynamic theme randomizer (Shuffle) to let users discover fresh themes.

---

## 🚀 How It Works

### Cookie-Based Hydration Sync
Traditional client-side theme engines cause layout flashes or hydration errors because React builds static HTML on the server before client-side scripts execute and discover the user's stored preferences.

**Next Switchcn** solves this with a **hybrid Cookie-based sync mechanism**:
1. When a user updates their theme or color preference, it is saved to both `localStorage` and written to standard `document.cookie` headers (`app-color-mode`, `app-theme-name`).
2. On subsequent loads, the root Next.js Layout (an asynchronous Server Component) reads the cookies from the incoming headers.
3. The server immediately renders the `<html>` element with the correct theme class.
4. When React hydrates on the client, the DOM matches the server-rendered DOM *perfectly*, resulting in a fluid first-load experience with zero console errors.

---

## 🛡️ License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it in your own creative works!
