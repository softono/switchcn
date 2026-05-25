"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { themesCatalog as themes } from "./theme-registry";

// ─── Colour swatch dot ────────────────────────────────────────────────────────
function Swatch({ color }: { color: string | null }) {
  if (!color)
    return <span style={{ width: 13, height: 13, display: "inline-block" }} />;
  return (
    <span
      style={{
        width: 13,
        height: 13,
        borderRadius: "50%",
        background: color,
        border: "1px solid rgba(255,255,255,0.12)",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export interface ThemeSwitcherProps {
  size?: "small" | "large";
}

export function ThemeSwitcher({ size = "small" }: ThemeSwitcherProps = {}) {
  const { theme: activeTheme, colorMode, setTheme, setColorMode } = useTheme();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = themes.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (name: string) => {
    setTheme(name);
    setOpen(false);
    setSearch("");
  };

  const shuffle = () => {
    const pick = themes[Math.floor(Math.random() * themes.length)];
    setTheme(pick.name);
  };

  const cycleColorMode = () => {
    const modes = ["light", "system", "dark"] as const;
    const next = modes[(modes.indexOf(colorMode) + 1) % modes.length];
    setColorMode(next);
  };

  const modeIcon = {
    light: (
      // Sun
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    system: (
      // Monitor
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    dark: (
      // Moon
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        width: size === "small" ? "fit-content" : 280,
      }}
    >
      {/* ── Trigger ── */}
      {size === "small" ? (
        <button
          id="theme-switcher-trigger"
          onClick={() => setOpen((o) => !o)}
          title={`Active Theme: ${activeTheme.label}`}
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: open ? "#2a2a2e" : "#1c1c1f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            cursor: "pointer",
            color: "#fff",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#2a2a2e";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            if (!open) {
              e.currentTarget.style.background = "#1c1c1f";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }
          }}
        >
          {/* Paint palette icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.9 }}
          >
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.34458 19.486 5.38575 20.2528 4.95759 20.7879C4.54284 21.3063 3.8647 22 3 22" />
            <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
            <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
            <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
            <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" />
          </svg>
        </button>
      ) : (
        <button
          id="theme-switcher-trigger"
          onClick={() => setOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: open ? "#2a2a2e" : "#1c1c1f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "9px 12px",
            cursor: "pointer",
            color: "#fff",
            transition: "background 0.15s",
          }}
        >
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {activeTheme.swatches.map((c, i) => (
              <Swatch key={i} color={c} />
            ))}
          </span>
          <span
            style={{
              flex: 1,
              textAlign: "left",
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {activeTheme.label}
          </span>
          {/* colour-mode icon */}
          <span
            style={{ color: "#888", display: "flex" }}
            onClick={(e) => {
              e.stopPropagation();
              cycleColorMode();
            }}
            title={`Mode: ${colorMode}`}
          >
            {modeIcon[colorMode]}
          </span>
          {/* chevron */}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d={open ? "M3 10l5-5 5 5" : "M3 6l5 5 5-5"}
              stroke="#888"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* ── Dropdown Panel ── */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: size === "small" ? undefined : 0,
            right: 0,
            zIndex: 100,
            background: "#1c1c1f",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* Search */}
          <div style={{ padding: "12px 12px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: "#262629",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "7px 11px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#666" strokeWidth="1.6" />
                <path d="M11 11l3 3" stroke="#666" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search themes…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#e5e5e5",
                  fontSize: 13,
                  caretColor: "#e5e5e5",
                }}
              />
            </div>
          </div>

          {/* Count + shuffle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 14px 5px",
            }}
          >
            <span style={{ fontSize: 12, color: "#555" }}>
              {filtered.length} theme{filtered.length !== 1 ? "s" : ""}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {/* colour-mode cycle button */}
              <button
                onClick={cycleColorMode}
                title={`Mode: ${colorMode} — click to cycle`}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 7,
                  color: "#888",
                  display: "flex",
                }}
              >
                {modeIcon[colorMode]}
              </button>
              {/* Shuffle */}
              <button
                onClick={shuffle}
                title="Random theme"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 7,
                  color: "#888",
                  display: "flex",
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Divider label */}
          <div
            style={{
              padding: "4px 14px 4px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#444",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Built-in Themes
            </span>
          </div>

          {/* Theme list */}
          <div
            style={{
              maxHeight: 300,
              overflowY: "auto",
              padding: "4px 6px 6px",
              scrollbarWidth: "thin",
              scrollbarColor: "#333 transparent",
            }}
          >
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "18px",
                  textAlign: "center",
                  color: "#555",
                  fontSize: 13,
                }}
              >
                No themes found
              </div>
            )}
            {filtered.map((t) => {
              const isSelected = activeTheme.name === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => handleSelect(t.name)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 9px",
                    borderRadius: 8,
                    border: "none",
                    background: isSelected
                    ? "rgba(255,255,255,0.07)"
                    : "transparent",
                    cursor: "pointer",
                    color: "#e5e5e5",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Swatches */}
                  <span
                    style={{
                      display: "flex",
                      gap: 3,
                      alignItems: "center",
                      minWidth: 60,
                    }}
                  >
                    {t.swatches.map((c, i) => (
                      <Swatch key={i} color={c} />
                    ))}
                  </span>
                  {/* Label */}
                  <span
                    style={{
                      flex: 1,
                      textAlign: "left",
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? "#fff" : "#d4d4d4",
                    }}
                  >
                    {t.label}
                  </span>
                  {/* Checkmark */}
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8l4 4 6-6"
                        stroke="#aaa"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
