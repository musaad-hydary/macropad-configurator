import { useState } from "react";
import { KEY_OPTIONS, CATEGORIES, validateKeyValue } from "../lib/keycodes";
import type { KeyMapping, KnobMapping } from "../lib/config";

interface Theme {
  glass: string;
  glassBorder: string;
  text: string;
  textDim: string;
  [key: string]: string;
}

interface KeyEditorProps {
  keyIndex: number;
  mapping: KeyMapping;
  onChange: (value: string) => void;
  onLabel: (label: string) => void;
  theme: Theme;
}

interface KnobEditorProps {
  mapping: KnobMapping;
  onChange: (knob: KnobMapping) => void;
  theme: Theme;
}

export function KeyEditor({
  keyIndex,
  mapping,
  onChange,
  onLabel,
  theme: t,
}: KeyEditorProps) {
  const isPreset = KEY_OPTIONS.some((k) => k.value === mapping.value);
  const [custom, setCustom] = useState(!isPreset);
  const [validationError, setValidationError] = useState<string | null>(null);

  return (
    <div style={glass(t)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={label(t)}>KEY {keyIndex + 1}</div>

        {/* Custom label input */}
        <input
          value={mapping.label}
          onChange={(e) => onLabel(e.target.value)}
          placeholder={`Key ${keyIndex + 1}`}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${t.glassBorder}`,
            color: t.text,
            fontSize: "11px",
            outline: "none",
            padding: "2px 4px",
            width: "90px",
            textAlign: "right",
            fontFamily: "-apple-system, system-ui, sans-serif",
          }}
        />
      </div>

      {/* Mode tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
        <ModeTab
          active={!custom}
          onClick={() => {
            setCustom(false);
            setValidationError(null);
          }}
          t={t}
        >
          Presets
        </ModeTab>
        <ModeTab active={custom} onClick={() => setCustom(true)} t={t}>
          Custom
        </ModeTab>
      </div>

      {!custom ? (
        <select
          value={isPreset ? mapping.value : ""}
          onChange={(e) => onChange(e.target.value)}
          style={select(t)}
        >
          <option value="">Select action...</option>
          {CATEGORIES.map((cat) => (
            <optgroup key={cat} label={cat}>
              {KEY_OPTIONS.filter((k) => k.category === cat).map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      ) : (
        <div>
          <input
            value={mapping.value}
            onChange={(e) => {
              const val = e.target.value;
              onChange(val);
              setValidationError(validateKeyValue(val));
            }}
            placeholder="e.g. cmd-shift-4"
            style={{
              ...select(t),
              fontFamily: "monospace",
              borderColor: validationError ? "rgba(255,80,80,0.5)" : undefined,
            }}
          />
          {validationError ? (
            <div
              style={{
                fontSize: "10px",
                color: "rgba(255,80,80,0.8)",
                marginTop: "6px",
              }}
            >
              ⚠ {validationError}
            </div>
          ) : (
            <div
              style={{
                fontSize: "10px",
                color: t.textDim,
                marginTop: "8px",
                lineHeight: "1.7",
              }}
            >
              Modifiers joined by dashes
              <br />
              <span style={{ opacity: 0.7 }}>
                cmd · shift · ctrl · alt · opt
                <br />
                cmd-shift-4 · cmd-z · f13 · ctrl-up
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function KnobEditor({ mapping, onChange, theme: t }: KnobEditorProps) {
  const [customFields, setCustomFields] = useState<Record<string, boolean>>({
    cw: !KEY_OPTIONS.some((k) => k.value === mapping.cw),
    ccw: !KEY_OPTIONS.some((k) => k.value === mapping.ccw),
    press: !KEY_OPTIONS.some((k) => k.value === mapping.press),
  });

  const [knobErrors, setKnobErrors] = useState<Record<string, string | null>>({
    cw: null,
    ccw: null,
    press: null,
  });

  const makeSelectHandler =
    (field: "cw" | "ccw" | "press") =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      onChange({ ...mapping, [field]: e.target.value });

  const makeInputHandler =
    (field: "cw" | "ccw" | "press") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChange({ ...mapping, [field]: val });
      setKnobErrors((prev) => ({ ...prev, [field]: validateKeyValue(val) }));
    };

  const toggleCustom = (field: "cw" | "ccw" | "press") => {
    setCustomFields((prev) => ({ ...prev, [field]: !prev[field] }));
    setKnobErrors((prev) => ({ ...prev, [field]: null }));
  };

  const knobField = (field: "cw" | "ccw" | "press", fieldLabel: string) => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <div style={subLabel(t)}>{fieldLabel}</div>
        <button
          onClick={() => toggleCustom(field)}
          style={{
            background: "transparent",
            border: "none",
            color: t.textDim,
            fontSize: "10px",
            cursor: "pointer",
            padding: "0",
            letterSpacing: "0.05em",
          }}
        >
          {customFields[field] ? "presets" : "custom"}
        </button>
      </div>
      {!customFields[field] ? (
        <select
          value={mapping[field]}
          onChange={makeSelectHandler(field)}
          style={select(t)}
        >
          {CATEGORIES.map((cat) => (
            <optgroup key={cat} label={cat}>
              {KEY_OPTIONS.filter((k) => k.category === cat).map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      ) : (
        <div>
          <input
            value={mapping[field]}
            onChange={makeInputHandler(field)}
            placeholder="e.g. cmd-shift-4"
            style={{
              ...select(t),
              fontFamily: "monospace",
              borderColor: knobErrors[field]
                ? "rgba(255,80,80,0.5)"
                : undefined,
            }}
          />
          {knobErrors[field] && (
            <div
              style={{
                fontSize: "10px",
                color: "rgba(255,80,80,0.8)",
                marginTop: "4px",
              }}
            >
              ⚠ {knobErrors[field]}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={glass(t)}>
      <div style={label(t)}>KNOB</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {knobField("cw", "↻ Clockwise")}
        {knobField("ccw", "↺ Counter-clockwise")}
        {knobField("press", "↓ Press")}
      </div>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
  t,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  t: Theme;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "5px",
        borderRadius: "8px",
        border: `1px solid ${active ? t.glassBorder : "transparent"}`,
        background: active ? t.glass : "transparent",
        color: active ? t.text : t.textDim,
        fontSize: "11px",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

const glass = (t: Theme): React.CSSProperties => ({
  background: t.glass,
  border: `1px solid ${t.glassBorder}`,
  borderRadius: "16px",
  padding: "14px",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
});

const label = (t: Theme): React.CSSProperties => ({
  fontSize: "10px",
  color: t.textDim,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  marginBottom: "0",
});

const subLabel = (t: Theme): React.CSSProperties => ({
  fontSize: "10px",
  color: t.textDim,
  marginBottom: "0",
});

const select = (t: Theme): React.CSSProperties => ({
  width: "100%",
  background: t.glass,
  border: `1px solid ${t.glassBorder}`,
  borderRadius: "10px",
  padding: "8px 10px",
  color: t.text,
  fontSize: "12px",
  outline: "none",
  cursor: "pointer",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
});
