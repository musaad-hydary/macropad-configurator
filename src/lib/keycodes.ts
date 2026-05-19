export interface KeyOption {
  label: string;
  category: string;
  value: string;
}

export const MODIFIERS = [
  "ctrl",
  "shift",
  "alt",
  "cmd",
  "rctrl",
  "rshift",
  "ralt",
  "rcmd",
];

export const KEY_OPTIONS: KeyOption[] = [
  // Common shortcuts
  { category: "Shortcuts", label: "Cmd + C", value: "cmd-c" },
  { category: "Shortcuts", label: "Cmd + V", value: "cmd-v" },
  { category: "Shortcuts", label: "Cmd + X", value: "cmd-x" },
  { category: "Shortcuts", label: "Cmd + Z", value: "cmd-z" },
  { category: "Shortcuts", label: "Cmd + Shift + Z", value: "cmd-shift-z" },
  { category: "Shortcuts", label: "Cmd + S", value: "cmd-s" },
  { category: "Shortcuts", label: "Cmd + Shift + S", value: "cmd-shift-s" },
  { category: "Shortcuts", label: "Cmd + A", value: "cmd-a" },
  { category: "Shortcuts", label: "Cmd + F", value: "cmd-f" },
  { category: "Shortcuts", label: "Cmd + W", value: "cmd-w" },
  { category: "Shortcuts", label: "Cmd + T", value: "cmd-t" },
  { category: "Shortcuts", label: "Cmd + N", value: "cmd-n" },
  { category: "Shortcuts", label: "Cmd + Q", value: "cmd-q" },
  { category: "Shortcuts", label: "Cmd + Tab", value: "cmd-tab" },
  { category: "Shortcuts", label: "Cmd + Space", value: "cmd-space" },
  { category: "Shortcuts", label: "Cmd + ,", value: "cmd-comma" },

  // Mac system
  { category: "Mac", label: "Screenshot Area", value: "cmd-shift-4" },
  { category: "Mac", label: "Screenshot Options", value: "cmd-shift-5" },
  { category: "Mac", label: "Spotlight", value: "cmd-space" },
  { category: "Mac", label: "Mission Control", value: "ctrl-up" },
  { category: "Mac", label: "App Exposé", value: "ctrl-down" },
  { category: "Mac", label: "Show Desktop", value: "f11" },
  { category: "Mac", label: "Lock Screen", value: "screenlock" },
  { category: "Mac", label: "Brightness Up", value: "macbrightnessup" },
  { category: "Mac", label: "Brightness Down", value: "macbrightnessdown" },

  // Media
  { category: "Media", label: "Play / Pause", value: "play" },
  { category: "Media", label: "Next Track", value: "next" },
  { category: "Media", label: "Prev Track", value: "prev" },
  { category: "Media", label: "Volume Up", value: "volumeup" },
  { category: "Media", label: "Volume Down", value: "volumedown" },
  { category: "Media", label: "Mute", value: "mute" },
  { category: "Media", label: "Stop", value: "stop" },

  // Mouse 
  { category: "Mouse", label: "Left Click", value: "click(left)" },
  { category: "Mouse", label: "Right Click", value: "click(right)" },
  { category: "Mouse", label: "Middle Click", value: "click(middle)" },
  { category: "Mouse", label: "Scroll Up", value: "wheel(-5)" },
  { category: "Mouse", label: "Scroll Down", value: "wheel(5)" },
  { category: "Mouse", label: "Scroll Up Fast", value: "wheel(-15)" },
  { category: "Mouse", label: "Scroll Down Fast", value: "wheel(15)" },

  // Navigation 
  { category: "Navigation", label: "Up", value: "up" },
  { category: "Navigation", label: "Down", value: "down" },
  { category: "Navigation", label: "Left", value: "left" },
  { category: "Navigation", label: "Right", value: "right" },
  { category: "Navigation", label: "Home", value: "home" },
  { category: "Navigation", label: "End", value: "end" },
  { category: "Navigation", label: "Page Up", value: "pageup" },
  { category: "Navigation", label: "Page Down", value: "pagedown" },
  { category: "Navigation", label: "Delete", value: "delete" },
  { category: "Navigation", label: "Backspace", value: "backspace" },
  { category: "Navigation", label: "Escape", value: "escape" },
  { category: "Navigation", label: "Tab", value: "tab" },
  { category: "Navigation", label: "Space", value: "space" },
  { category: "Navigation", label: "Enter", value: "enter" },
  { category: "Navigation", label: "Caps Lock", value: "capslock" },

  // Function keys 
  { category: "Function", label: "F1", value: "f1" },
  { category: "Function", label: "F2", value: "f2" },
  { category: "Function", label: "F3", value: "f3" },
  { category: "Function", label: "F4", value: "f4" },
  { category: "Function", label: "F5", value: "f5" },
  { category: "Function", label: "F6", value: "f6" },
  { category: "Function", label: "F7", value: "f7" },
  { category: "Function", label: "F8", value: "f8" },
  { category: "Function", label: "F9", value: "f9" },
  { category: "Function", label: "F10", value: "f10" },
  { category: "Function", label: "F11", value: "f11" },
  { category: "Function", label: "F12", value: "f12" },
  { category: "Function", label: "F13", value: "f13" },
  { category: "Function", label: "F14", value: "f14" },
  { category: "Function", label: "F15", value: "f15" },
  { category: "Function", label: "F16", value: "f16" },
  { category: "Function", label: "F17", value: "f17" },
  { category: "Function", label: "F18", value: "f18" },
  { category: "Function", label: "F19", value: "f19" },
  { category: "Function", label: "F20", value: "f20" },
  { category: "Function", label: "F21", value: "f21" },
  { category: "Function", label: "F22", value: "f22" },
  { category: "Function", label: "F23", value: "f23" },
  { category: "Function", label: "F24", value: "f24" },

  // Letters 
  ..."abcdefghijklmnopqrstuvwxyz".split("").map((c) => ({
    category: "Keys",
    label: c.toUpperCase(),
    value: c,
  })),

  // Numbers
  ..."0123456789".split("").map((n) => ({
    category: "Keys",
    label: n,
    value: n,
  })),
];

export const CATEGORIES = [...new Set(KEY_OPTIONS.map((k) => k.category))];

// Validation

const VALID_KEYS = new Set([
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "enter",
  "escape",
  "backspace",
  "tab",
  "space",
  "minus",
  "equal",
  "leftbracket",
  "rightbracket",
  "backslash",
  "semicolon",
  "quote",
  "grave",
  "comma",
  "dot",
  "slash",
  "capslock",
  "printscreen",
  "insert",
  "home",
  "pageup",
  "delete",
  "end",
  "pagedown",
  "right",
  "left",
  "down",
  "up",
  "numlock",
  "numpadslash",
  "numpadasterisk",
  "numpadminus",
  "numpadplus",
  "numpadenter",
  "numpad1",
  "numpad2",
  "numpad3",
  "numpad4",
  "numpad5",
  "numpad6",
  "numpad7",
  "numpad8",
  "numpad9",
  "numpad0",
  "numpaddot",
  "application",
  "power",
  "numpadequal",
  "nonushash",
  "nonusbackslash",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "f10",
  "f11",
  "f12",
  "f13",
  "f14",
  "f15",
  "f16",
  "f17",
  "f18",
  "f19",
  "f20",
  "f21",
  "f22",
  "f23",
  "f24",
  "macbrightnessdown",
  "macbrightnessup",
  "screenlock",
  "next",
  "prev",
  "previous",
  "stop",
  "play",
  "mute",
  "volumeup",
  "volumedown",
  "favorites",
  "calculator",
]);

const VALID_MODS = new Set([
  "ctrl",
  "shift",
  "alt",
  "opt",
  "cmd",
  "win",
  "rctrl",
  "rshift",
  "ralt",
  "ropt",
  "rcmd",
  "rwin",
]);

export function validateKeyValue(value: string): string | null {
  if (!value.trim()) return "Key cannot be empty";

  // Allow mouse actions: click(...), wheel(...), move(...), drag(...)
  if (/^(click|wheel|move|drag)\(/.test(value)) return null;

  // Allow custom decimal keycodes: <110>
  if (/^<\d+>$/.test(value)) return null;

  const parts = value.toLowerCase().split("-");
  const key = parts[parts.length - 1];
  const mods = parts.slice(0, -1);

  for (const mod of mods) {
    if (!VALID_MODS.has(mod)) {
      return `Unknown modifier: "${mod}" — valid: cmd shift ctrl alt opt`;
    }
  }

  if (!VALID_KEYS.has(key)) {
    return `Unknown key: "${key}" — check spelling or use <110> format`;
  }

  return null;
}
