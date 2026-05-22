"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { themesCatalog } from "./registry";
import { loadTheme, type ThemeMeta, type ThemeTokens } from "./loader";

type ColorMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: ThemeMeta;
  colorMode: ColorMode;
  setTheme: (name: string) => void;
  setColorMode: (mode: ColorMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function tokensToStyle(tokens: ThemeTokens): string {
  return Object.entries(tokens)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([k, v]) => {
      const suffix = k.startsWith("font-") ? " !important" : "";
      return `  --${k}: ${v}${suffix};`;
    })
    .join("\n");
}



export const applyThemeScript = `(function(){
  try {
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
    var name=getCookie('app-theme')||localStorage.getItem('app-theme')||'default';
    var mode=getCookie('app-color-mode')||localStorage.getItem('app-color-mode')||'system';
    var prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
    var isDark=mode==='dark'||(mode==='system'&&prefersDark);
    if(isDark) document.documentElement.classList.add('dark');

    if(name!=='default'){
      var cachedFonts=localStorage.getItem('app-theme-fonts');
      if(cachedFonts){
        var fonts=JSON.parse(cachedFonts);
        if(fonts && fonts.length > 0){
          var fontEl=document.createElement('link');
          fontEl.id='app-theme-fonts';
          fontEl.rel='stylesheet';
          var families=fonts.map(function(f){
            return 'family='+encodeURIComponent(f).replace(/%20/g,'+') + ':wght@300;400;500;600;700';
          }).join('&');
          fontEl.href='https://fonts.googleapis.com/css2?'+families+'&display=swap';
          document.head.appendChild(fontEl);
        }
      }
    }

    var el=document.createElement('style');
    el.id='app-theme-vars';
    document.head.appendChild(el);
    if(name!=='default'){
      var cached=localStorage.getItem('app-theme-vars');
      if(cached){
        var theme=JSON.parse(cached);
        var css=':root, body{';
        for(var k in theme.light){
          if(theme.light[k]!=null) {
            var suffix = k.indexOf('font-') === 0 ? ' !important' : '';
            css+='--'+k+':'+theme.light[k]+suffix+';';
          }
        }
        css+='}.dark, .dark body{';
        for(var k in theme.dark){
          if(theme.dark[k]!=null) {
            var suffix = k.indexOf('font-') === 0 ? ' !important' : '';
            css+='--'+k+':'+theme.dark[k]+suffix+';';
          }
        }
        css+='}';
        el.textContent=css;
      }
    }
  } catch(e){}
})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState("default");
  const [colorMode, setColorModeState] = useState<ColorMode>("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      setThemeName(savedTheme);
    }
    const savedColorMode = localStorage.getItem("app-color-mode");
    if (savedColorMode) {
      setColorModeState(savedColorMode as ColorMode);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemPref = (e: MediaQueryListEvent | MediaQueryList) => {
      const prefersDark = e.matches;
      document.cookie = `app-system-prefers-dark=${prefersDark}; path=/; max-age=31536000; SameSite=Lax`;
    };
    
    updateSystemPref(mediaQuery);
    mediaQuery.addEventListener("change", updateSystemPref);
    
    return () => {
      mediaQuery.removeEventListener("change", updateSystemPref);
    };
  }, []);

  useEffect(() => {
    const savedColorMode = typeof window !== "undefined" ? localStorage.getItem("app-color-mode") : null;
    if (savedColorMode && savedColorMode !== colorMode) {
      return;
    }

    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      colorMode === "dark" || (colorMode === "system" && prefersDark);
    root.classList.toggle("dark", isDark);
  }, [colorMode]);

  useEffect(() => {
    let active = true;

    async function applyTheme() {
      if (themeName === "default") {
        const savedTheme = typeof window !== "undefined" ? localStorage.getItem("app-theme") : null;
        if (savedTheme && savedTheme !== "default") {
          return;
        }

        const el = document.getElementById("app-theme-vars");
        if (el) el.textContent = "";
        localStorage.removeItem("app-theme-vars");

        const fontEl = document.getElementById("app-theme-fonts");
        if (fontEl) fontEl.remove();
        localStorage.removeItem("app-theme-fonts");
        return;
      }

      try {
        const theme = await loadTheme(themeName);
        if (!active) return;

        const fontStyleId = "app-theme-fonts";
        let fontEl = document.getElementById(fontStyleId) as HTMLLinkElement | null;
        if (theme.fonts && theme.fonts.length > 0) {
          if (!fontEl) {
            fontEl = document.createElement("link");
            fontEl.id = fontStyleId;
            fontEl.rel = "stylesheet";
            document.head.appendChild(fontEl);
          }
          const families = theme.fonts
            .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@300;400;500;600;700`)
            .join("&");
          fontEl.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
          localStorage.setItem("app-theme-fonts", JSON.stringify(theme.fonts));
        } else {
          if (fontEl) fontEl.remove();
          localStorage.removeItem("app-theme-fonts");
        }

        const styleId = "app-theme-vars";
        let el = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!el) {
          el = document.createElement("style");
          el.id = styleId;
          document.head.appendChild(el);
        }
        el.textContent = `:root, body {\n${tokensToStyle(theme.light)}\n}\n.dark, .dark body {\n${tokensToStyle(theme.dark)}\n}`;

        localStorage.setItem(
          "app-theme-vars",
          JSON.stringify({
            light: theme.light,
            dark: theme.dark,
          })
        );
      } catch (err) {
        console.error("Failed to load theme dynamically:", err);
      }
    }

    applyTheme();

    return () => {
      active = false;
    };
  }, [themeName]);

  const setTheme = useCallback((name: string) => {
    setThemeName(name);
    localStorage.setItem("app-theme", name);
    document.cookie = `app-theme=${name}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem("app-color-mode", mode);
    document.cookie = `app-color-mode=${mode}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const theme = themesCatalog.find((t) => t.name === themeName) ?? themesCatalog[0];

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
