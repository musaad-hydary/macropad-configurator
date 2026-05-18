export interface KeyMapping {
  index: number;
  label: string;
  value: string;
}

export interface KnobMapping {
  cw: string;
  ccw: string;
  press: string;
}

export interface MacropadConfig {
  keys: KeyMapping[];
  knob: KnobMapping;
  led: number; // 0=off 1=tap 2=rainbow 3=steady
}

export const DEFAULT_CONFIG: MacropadConfig = {
  keys: [
    { index: 0, label: "Key 1", value: "cmd-c" },
    { index: 1, label: "Key 2", value: "cmd-v" },
    { index: 2, label: "Key 3", value: "cmd-z" },
  ],
  knob: { cw: "volumeup", ccw: "volumedown", press: "mute" },
  led: 3,
};

// ── Tauri bridge ──────────────────────────────────────────────────────────────

async function tauriInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>,
): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(cmd, args);
}

const isTauri = () =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

// ── Public API ────────────────────────────────────────────────────────────────

export async function checkConnected(): Promise<boolean> {
  if (!isTauri()) return true;
  try {
    return await tauriInvoke<boolean>("is_connected");
  } catch {
    return false;
  }
}

export async function saveConfig(config: MacropadConfig): Promise<void> {
  if (!isTauri()) {
    console.warn("Not in Tauri");
    return;
  }
  try {
    await tauriInvoke("save_and_upload", { cfg: config });
    console.log("Config saved and uploaded");
  } catch (e) {
    console.error("Failed:", e);
    throw e;
  }
}

export async function loadConfig(): Promise<MacropadConfig> {
  if (!isTauri()) return DEFAULT_CONFIG;
  try {
    return await tauriInvoke<MacropadConfig>("get_config");
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function setLed(mode: number): Promise<void> {
  if (!isTauri()) return;
  try {
    await tauriInvoke("set_led", { mode });
  } catch (e) {
    console.error("LED failed:", e);
    throw e;
  }
}

export function exportConfig(config: MacropadConfig): void {
  const json = JSON.stringify(config, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "macropad-config.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importConfig(): Promise<MacropadConfig> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return reject(new Error("No file selected"));
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const cfg = JSON.parse(ev.target?.result as string) as MacropadConfig;
          // Basic validation
          if (!cfg.keys || !cfg.knob) throw new Error("Invalid config file");
          resolve(cfg);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}
