# Macropad Configurator

A native Mac app for configuring CH57x-based macro keyboards (VID `0x1189` / PID `0x8890`).

Writes key mappings directly to device firmware — no drivers, no Karabiner, no background services. Mappings persist on the device and work on any computer.

![Macropad Configurator UI](https://raw.githubusercontent.com/musaad-hydary/macropad-configurator/main/screenshot.png)

> Read about how it was built: [CH57x Macropad Configurator for Mac](https://musaadh.substack.com/p/ch57x-macropad-configurator-for-mac)

## Features

- **Key remapping** — choose from presets or type any custom combo (`cmd-shift-4`, `f13`, `click(left)`)
- **Knob configuration** — map clockwise, counter-clockwise, and press independently
- **LED control** — four modes: off, tap-to-light, rainbow cycle, steady on
- **Custom labels** — rename keys to show what they do
- **Preset profiles** — one-click layouts for Mac, Creative, Dev, Media, Screenshot, Scroll
- **Validation** — catches typos in custom key combos before upload
- **Connection indicator** — live USB device detection via ioreg
- **Dark / light mode** — persists between sessions

## Requirements

- macOS (Apple Silicon or Intel)
- CH57x macropad connected via USB cable

## Installation

1. Download `Macropad Configurator.dmg` from Releases
2. Open the DMG and drag to Applications
3. Launch the app
4. Plug in your macropad via USB
5. Configure and hit **Save & Apply**

## Supported Devices

Any CH57x keyboard with vendor ID `0x1189` and product IDs `0x8890`, `0x8840`, or `0x8842`.

Tested on the 3x1 + 1 knob model.

## Custom Key Format

Keys use dash-separated modifier + key combos:

```
cmd-c            → ⌘C
cmd-shift-4      → ⌘⇧4
ctrl-alt-delete
f13
click(left)      → left mouse click
wheel(-5)        → scroll up
wheel(5)         → scroll down
```

Valid modifiers: `cmd` `shift` `ctrl` `alt` `opt`

## How It Works

Uses [ch57x-keyboard-tool](https://github.com/kriomant/ch57x-keyboard-tool), which reverse-engineered the USB HID configuration protocol for CH57x devices. Key mappings are compiled to YAML and written directly to device firmware over USB. Changes survive power cycles and work on any OS without any software installed.

## Building from Source

```bash
# Prerequisites
npm install

# Dev
npm run tauri dev

# Release
npm run tauri build
```

## License

MIT
