import { useState, useEffect } from "react";
import KeyPad from "./components/KeyPad";
import { KeyEditor, KnobEditor } from "./components/KeyEditor";
import {
  DEFAULT_CONFIG,
  loadConfig,
  saveConfig,
  setLed,
  checkConnected,
  type MacropadConfig,
  type KnobMapping,
} from "./lib/config";
import { PRESETS } from "./lib/presets";

// Themes

const DARK = {
  bg: "#111111",
  glass: "rgba(255,255,255,0.05)",
  glassBorder: "rgba(255,255,255,0.09)",
  text: "rgba(255,255,255,0.88)",
  textDim: "rgba(255,255,255,0.38)",
  textFaint: "rgba(255,255,255,0.18)",
  success: "rgba(34,197,94,0.9)",
  error: "rgba(255,80,80,0.9)",
};

const LIGHT = {
  bg: "#e8e8e8",
  glass: "rgba(180,180,180,0.3)",
  glassBorder: "rgba(140,140,140,0.35)",
  text: "rgba(30,30,30,0.88)",
  textDim: "rgba(30,30,30,0.45)",
  textFaint: "rgba(30,30,30,0.25)",
  success: "rgba(22,163,74,0.9)",
  error: "rgba(220,50,50,0.9)",
};

type Theme = typeof DARK;

const LED_MODES = [
  { mode: 0, icon: "⚫", label: "Off" },
  { mode: 1, icon: "✨", label: "Tap" },
  { mode: 2, icon: "🌈", label: "Rainbow" },
  { mode: 3, icon: "💡", label: "Steady" },
];

type View = "main" | "presets" | "onboarding";

export default function App() {
  const [config, setConfig] = useState<MacropadConfig>(DEFAULT_CONFIG);
  const [selectedKey, setSelectedKey] = useState<number | "knob" | null>(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [view, setView] = useState<View>("main");
  const [dotHovered, setDotHovered] = useState(false);

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("macropad-theme") !== "light";
  });

  const t: Theme = dark ? DARK : LIGHT;

  useEffect(() => {
    const seen = localStorage.getItem("macropad-seen");
    if (!seen) {
      setView("onboarding");
      localStorage.setItem("macropad-seen", "1");
    }

    loadConfig().then(setConfig);

    const check = async () => setConnected(await checkConnected());
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyChange = (index: number, value: string) => {
    setConfig((prev) => ({
      ...prev,
      keys: prev.keys.map((k, i) => (i === index ? { ...k, value } : k)),
    }));
    setDirty(true);
    setSaved(false);
  };

  const handleLabelChange = (index: number, label: string) => {
    setConfig((prev) => ({
      ...prev,
      keys: prev.keys.map((k, i) => (i === index ? { ...k, label } : k)),
    }));
    setDirty(true);
    setSaved(false);
  };

  const handleKnobChange = (knob: KnobMapping) => {
    setConfig((prev) => ({ ...prev, knob }));
    setDirty(true);
    setSaved(false);
  };

  const handleLed = async (mode: number) => {
    const prev = config.led;
    setConfig((c) => ({ ...c, led: mode }));
    try {
      await setLed(mode);
    } catch (e) {
      setError(String(e));
      setConfig((c) => ({ ...c, led: prev }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveConfig(config);
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(String(e));
    }
    setSaving(false);
  };

  const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: t.glass,
    border: `1px solid ${t.glassBorder}`,
    borderRadius: "14px",
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
    boxShadow: dark
      ? "inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 12px rgba(0,0,0,0.4)"
      : "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.08)",
    ...extra,
  });

  const iconBtn = (extra?: React.CSSProperties): React.CSSProperties => ({
    ...glass({ padding: "7px 10px", borderRadius: "10px" }),
    color: t.textDim,
    fontSize: "13px",
    cursor: "pointer",
    border: `1px solid ${t.glassBorder}`,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...extra,
  });

  // Onboarding
  if (view === "onboarding") {
    return (
      <div
        style={{
          width: "420px",
          height: "520px",
          background: t.bg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          gap: "16px",
          fontFamily: "-apple-system, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: "40px" }}>⌨️</div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: t.text }}>
          Welcome to Macropad Configurator
        </div>
        <div
          style={{
            fontSize: "13px",
            color: t.textDim,
            textAlign: "center",
            lineHeight: "1.7",
            maxWidth: "300px",
          }}
        >
          Configure your 3-key macropad directly from here. Click any key to
          remap it, adjust the knob actions, and set your LED mode.
        </div>
        <div
          style={{
            ...glass({
              padding: "14px 18px",
              borderRadius: "12px",
              width: "100%",
            }),
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {[
            ["⌨️", "Click a key to remap it"],
            ["🎛️", "Click KNOB to configure the dial"],
            ["💡", "Use the LED buttons to set lighting"],
            ["📋", "Load a preset from the footer"],
          ].map(([icon, text]) => (
            <div
              key={text}
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              <span style={{ fontSize: "16px" }}>{icon}</span>
              <span style={{ fontSize: "12px", color: t.textDim }}>{text}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setView("main")}
          style={{
            ...glass({ padding: "12px 32px", borderRadius: "12px" }),
            color: t.text,
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            border: `1px solid ${t.glassBorder}`,
            marginTop: "8px",
            width: "100%",
          }}
        >
          Get Started →
        </button>
      </div>
    );
  }

  // Presets
  if (view === "presets") {
    return (
      <div
        style={{
          width: "420px",
          height: "520px",
          background: t.bg,
          display: "flex",
          flexDirection: "column",
          padding: "14px",
          gap: "10px",
          fontFamily: "-apple-system, system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            ...glass({ padding: "9px 14px" }),
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setView("main")}
            style={{
              background: "transparent",
              border: "none",
              color: t.textDim,
              fontSize: "16px",
              cursor: "pointer",
              padding: "0",
              lineHeight: "1",
            }}
          >
            ←
          </button>
          <span style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>
            Presets
          </span>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setConfig(preset.config);
                setDirty(true);
                setSaved(false);
                setView("main");
              }}
              style={{
                ...glass({ padding: "12px 16px", borderRadius: "12px" }),
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                border: `1px solid ${t.glassBorder}`,
                textAlign: "left",
                width: "100%",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "22px" }}>{preset.icon}</span>
              <div>
                <div
                  style={{ fontSize: "13px", fontWeight: 600, color: t.text }}
                >
                  {preset.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: t.textDim,
                    marginTop: "2px",
                  }}
                >
                  {preset.config.keys.map((k) => k.label).join(" · ")}
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: "12px", color: t.textFaint }}>→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Main
  return (
    <div
      style={{
        width: "420px",
        height: "520px",
        background: t.bg,
        display: "flex",
        flexDirection: "column",
        padding: "14px",
        gap: "10px",
        fontFamily: "-apple-system, SF Pro Display, system-ui, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          ...glass({ padding: "9px 14px" }),
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Connection dot */}
        <div style={{ position: "relative" }}>
          <div
            onMouseEnter={() => setDotHovered(true)}
            onMouseLeave={() => setDotHovered(false)}
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              flexShrink: 0,
              cursor: "default",
              background:
                connected === null
                  ? "rgba(150,150,150,0.4)"
                  : connected
                    ? "#4ade80"
                    : "#f87171",
              boxShadow:
                connected === null
                  ? "none"
                  : connected
                    ? "0 0 5px rgba(74,222,128,0.6)"
                    : "0 0 5px rgba(248,113,113,0.6)",
              transition: "all 0.3s ease",
            }}
          />
          {dotHovered && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                background: dark ? "#222" : "#fff",
                border: `1px solid ${t.glassBorder}`,
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "10px",
                color: t.text,
                whiteSpace: "nowrap",
                zIndex: 10,
                pointerEvents: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {connected === null
                ? "Checking..."
                : connected
                  ? "Connected"
                  : "Not connected"}
            </div>
          )}
        </div>

        <span style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>
          Macropad
        </span>

        <div style={{ flex: 1 }} />

        {/* LED mode picker */}
        <div style={{ display: "flex", gap: "4px" }}>
          {LED_MODES.map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => handleLed(mode)}
              title={label}
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                border: `1px solid ${config.led === mode ? "rgba(250,200,50,0.5)" : t.glassBorder}`,
                background:
                  config.led === mode ? "rgba(250,200,50,0.15)" : "transparent",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
                boxShadow:
                  config.led === mode
                    ? "0 0 7px rgba(250,200,50,0.25)"
                    : "none",
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Keypad */}
      <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
        <KeyPad
          config={config}
          selectedKey={selectedKey}
          onSelect={setSelectedKey}
          theme={t}
        />
      </div>

      {/* Editor */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {selectedKey === "knob" ? (
          <KnobEditor
            mapping={config.knob}
            onChange={handleKnobChange}
            theme={t}
          />
        ) : selectedKey !== null ? (
          <KeyEditor
            keyIndex={selectedKey}
            mapping={config.keys[selectedKey]}
            onChange={(value) => handleKeyChange(selectedKey, value)}
            onLabel={(label) => handleLabelChange(selectedKey, label)}
            theme={t}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              color: t.textFaint,
              fontSize: "12px",
              paddingTop: "20px",
            }}
          >
            Select a key to configure it
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          onClick={() => setError(null)}
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            background: "rgba(255,60,60,0.1)",
            border: "1px solid rgba(255,60,60,0.2)",
            color: t.error,
            fontSize: "11px",
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          {error} ✕
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={() =>
            setDark((d) => {
              const next = !d;
              localStorage.setItem("macropad-theme", next ? "dark" : "light");
              return next;
            })
          }
          title={dark ? "Light mode" : "Dark mode"}
          style={iconBtn()}
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Presets */}
        <button
          onClick={() => setView("presets")}
          title="Presets"
          style={iconBtn()}
        >
          📋
        </button>

        {/* Help */}
        <button
          onClick={() => setView("onboarding")}
          title="Help"
          style={iconBtn()}
        >
          ?
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: "10px",
            border: `1px solid ${saved ? "rgba(34,197,94,0.5)" : dirty ? "rgba(255,180,0,0.4)" : t.glassBorder}`,
            background: saved
              ? "rgba(34,197,94,0.15)"
              : dirty
                ? "rgba(255,180,0,0.08)"
                : t.glass,
            color: saved ? t.success : t.text,
            fontSize: "13px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: saved ? "0 0 16px rgba(34,197,94,0.15)" : "none",
            transition: "all 0.2s ease",
            letterSpacing: "0.02em",
          }}
        >
          {saving
            ? "Saving..."
            : saved
              ? "✓ Saved"
              : dirty
                ? "Save & Apply ●"
                : "Save & Apply"}
        </button>
      </div>
    </div>
  );
}
