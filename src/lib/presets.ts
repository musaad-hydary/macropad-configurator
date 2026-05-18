import type { MacropadConfig } from "./config";

export interface Preset {
  name: string;
  icon: string;
  config: MacropadConfig;
}

export const PRESETS: Preset[] = [
  {
    name: "Default Mac",
    icon: "🍎",
    config: {
      keys: [
        { index: 0, label: "Copy", value: "cmd-c" },
        { index: 1, label: "Paste", value: "cmd-v" },
        { index: 2, label: "Undo", value: "cmd-z" },
      ],
      knob: { cw: "volumeup", ccw: "volumedown", press: "mute" },
      led: 3,
    },
  },
  {
    name: "Creative",
    icon: "🎨",
    config: {
      keys: [
        { index: 0, label: "Undo", value: "cmd-z" },
        { index: 1, label: "Redo", value: "cmd-shift-z" },
        { index: 2, label: "Save", value: "cmd-s" },
      ],
      knob: { cw: "cmd-equal", ccw: "cmd-minus", press: "cmd-shift-z" },
      led: 2,
    },
  },
  {
    name: "Dev",
    icon: "💻",
    config: {
      keys: [
        { index: 0, label: "Terminal", value: "ctrl-grave" },
        { index: 1, label: "Run", value: "f5" },
        { index: 2, label: "Debug", value: "f9" },
      ],
      knob: { cw: "volumeup", ccw: "volumedown", press: "mute" },
      led: 1,
    },
  },
  {
    name: "Media",
    icon: "🎵",
    config: {
      keys: [
        { index: 0, label: "Prev", value: "prev" },
        { index: 1, label: "Play", value: "play" },
        { index: 2, label: "Next", value: "next" },
      ],
      knob: { cw: "volumeup", ccw: "volumedown", press: "mute" },
      led: 2,
    },
  },
  {
    name: "Screenshot",
    icon: "📸",
    config: {
      keys: [
        { index: 0, label: "Area", value: "cmd-shift-4" },
        { index: 1, label: "Window", value: "cmd-shift-4" },
        { index: 2, label: "Options", value: "cmd-shift-5" },
      ],
      knob: {
        cw: "macbrightnessup",
        ccw: "macbrightnessdown",
        press: "screenlock",
      },
      led: 3,
    },
  },
  {
    name: "Scroll",
    icon: "🖱️",
    config: {
      keys: [
        { index: 0, label: "Click", value: "click(left)" },
        { index: 1, label: "Scroll↑", value: "wheel(-5)" },
        { index: 2, label: "Scroll↓", value: "wheel(5)" },
      ],
      knob: { cw: "volumeup", ccw: "volumedown", press: "mute" },
      led: 1,
    },
  },
];
