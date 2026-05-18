import type { MacropadConfig } from "../lib/config";
import { KEY_OPTIONS } from "../lib/keycodes";

interface Theme {
  glass: string;
  glassBorder: string;
  text: string;
  textDim: string;
  [key: string]: string;
}

interface Props {
  config: MacropadConfig;
  selectedKey: number | "knob" | null;
  onSelect: (key: number | "knob") => void;
  theme: Theme;
}

export default function KeyPad({
  config,
  selectedKey,
  onSelect,
  theme: t,
}: Props) {
  return (
    <div
      style={{
        background: t.glass,
        border: `1px solid ${t.glassBorder}`,
        borderRadius: "18px",
        padding: "14px",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        {config.keys.map((key, i) => {
          const selected = selectedKey === i;
          const label =
            KEY_OPTIONS.find((k) => k.value === key.value)?.label ?? key.value;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                flex: 1,
                height: "68px",
                borderRadius: "13px",
                border: `1px solid ${selected ? "rgba(255,255,255,0.35)" : t.glassBorder}`,
                background: selected
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(255,255,255,0.04)",
                boxShadow: selected
                  ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(120,180,255,0.2)"
                  : "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  color: t.textDim,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                }}
              >
                Key {i + 1}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: selected ? t.text : t.textDim,
                  textAlign: "center",
                  padding: "0 4px",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}

        {/* Knob */}
        <button
          onClick={() => onSelect("knob")}
          style={{
            width: "68px",
            height: "68px",
            flexShrink: 0,
            borderRadius: "50%",
            border: `1px solid ${selectedKey === "knob" ? "rgba(255,255,255,0.35)" : t.glassBorder}`,
            background:
              selectedKey === "knob"
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.04)",
            boxShadow:
              selectedKey === "knob"
                ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(120,180,255,0.2)"
                : "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            transition: "all 0.15s ease",
          }}
        >
          <span style={{ fontSize: "18px", lineHeight: "1" }}>⟳</span>
          <span
            style={{
              fontSize: "8px",
              color: t.textDim,
              letterSpacing: "0.1em",
            }}
          >
            KNOB
          </span>
        </button>
      </div>
    </div>
  );
}
