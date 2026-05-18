use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeyMapping {
    pub index: usize,
    pub label: String,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KnobMapping {
    pub cw:    String,
    pub ccw:   String,
    pub press: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MacropadConfig {
    pub keys: Vec<KeyMapping>,
    pub knob: KnobMapping,
    pub led:  u8,   // 0=off 1=tap-light 2=rainbow 3=steady
}

impl Default for MacropadConfig {
    fn default() -> Self {
        Self {
            keys: vec![
                KeyMapping { index: 0, label: "Key 1".into(), value: "cmd-c".into() },
                KeyMapping { index: 1, label: "Key 2".into(), value: "cmd-v".into() },
                KeyMapping { index: 2, label: "Key 3".into(), value: "cmd-z".into() },
            ],
            knob: KnobMapping {
                cw:    "volumeup".into(),
                ccw:   "volumedown".into(),
                press: "mute".into(),
            },
            led: 3,
        }
    }
}

fn config_path() -> PathBuf {
    let home = std::env::var("HOME").expect("HOME not set");
    PathBuf::from(home)
        .join(".config")
        .join("macropad-configurator")
        .join("config.json")
}

pub fn load() -> MacropadConfig {
    let path = config_path();
    if !path.exists() { return MacropadConfig::default(); }
    let raw = fs::read_to_string(&path).unwrap_or_default();
    serde_json::from_str(&raw).unwrap_or_default()
}

pub fn save(config: &MacropadConfig) -> Result<(), String> {
    let path = config_path();
    if let Some(p) = path.parent() {
        fs::create_dir_all(p).map_err(|e| e.to_string())?;
    }
    let json = serde_json::to_string_pretty(config).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(())
}