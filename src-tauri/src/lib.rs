mod config;
mod ch57x;

use std::sync::{Arc, Mutex};

#[tauri::command]
fn get_config() -> config::MacropadConfig {
    config::load()
}

#[tauri::command]
fn save_and_upload(
    cfg:   config::MacropadConfig,
    state: tauri::State<Arc<Mutex<config::MacropadConfig>>>,
) -> Result<(), String> {
    config::save(&cfg)?;
    ch57x::upload(&cfg)?;
    ch57x::set_led(cfg.led)?;
    let mut live = state.lock().unwrap();
    *live = cfg;
    Ok(())
}

#[tauri::command]
fn set_led(mode: u8) -> Result<(), String> {
    ch57x::set_led(mode)
}

#[tauri::command]
fn is_connected() -> bool {
    ch57x::is_connected()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let live_config = Arc::new(Mutex::new(config::load()));

    tauri::Builder::default()
        .manage(live_config)
.invoke_handler(tauri::generate_handler![
    get_config,
    save_and_upload,
    set_led,
    is_connected,
])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}