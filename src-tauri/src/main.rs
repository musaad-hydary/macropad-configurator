#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
fn main() {
    macropad_configurator_lib::run();
}