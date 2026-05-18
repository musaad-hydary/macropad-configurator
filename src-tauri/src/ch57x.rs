use std::process::Command;
use std::io::Write;
use crate::config::MacropadConfig;

pub fn upload(config: &MacropadConfig) -> Result<(), String> {
    let yaml = build_yaml(config);
    eprintln!("Uploading YAML:\n{}", yaml);

    let binary = find_binary()?;

    let mut child = Command::new(&binary)
        .args([
            "--vendor-id",  "4489",
            "--product-id", "34960",
            "upload",
        ])
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn ch57x-keyboard-tool: {}", e))?;

    if let Some(stdin) = child.stdin.take() {
        let mut stdin = stdin;
        stdin.write_all(yaml.as_bytes())
            .map_err(|e| format!("Failed to write YAML: {}", e))?;
    }

    let output = child.wait_with_output()
        .map_err(|e| format!("Failed to wait: {}", e))?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Upload failed: {}", err));
    }

    eprintln!("Upload successful");
    Ok(())
}

pub fn set_led(mode: u8) -> Result<(), String> {
    let binary = find_binary()?;

    let output = Command::new(&binary)
        .args([
            "--vendor-id",  "4489",
            "--product-id", "34960",
            "led",
            &mode.to_string(),
        ])
        .output()
        .map_err(|e| format!("Failed to run ch57x-keyboard-tool: {}", e))?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        return Err(format!("LED command failed: {}", err));
    }

    eprintln!("LED mode {} set", mode);
    Ok(())
}

pub fn is_connected() -> bool {
    let binary = match find_binary() {
        Ok(b)  => b,
        Err(_) => return false,
    };

    let check_yaml = b"rows: 1\ncolumns: 3\nknobs: 1\nlayers:\n  - buttons:\n      - [a, b, c]\n    knobs:\n      - cw: mute\n        ccw: mute\n        press: mute\n";

    let child = Command::new(&binary)
        .args([
            "--vendor-id",  "4489",
            "--product-id", "34960",
            "validate",
        ])
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn();

    match child {
        Ok(mut c) => {
            if let Some(mut stdin) = c.stdin.take() {
                let _ = stdin.write_all(check_yaml);
            }
            match c.wait_with_output() {
                Ok(o) => {
                    let stderr = String::from_utf8_lossy(&o.stderr);
                    !stderr.contains("not found") && !stderr.contains("No such")
                }
                Err(_) => false,
            }
        }
        Err(_) => false,
    }
}

fn find_binary() -> Result<String, String> {
    // Check bundled binary first (inside .app bundle)
    if let Ok(exe) = std::env::current_exe() {
        let bundled = exe
            .parent()
            .map(|p| p.join("ch57x-keyboard-tool"));
        if let Some(path) = bundled {
            if path.exists() {
                return Ok(path.to_string_lossy().to_string());
            }
        }
    }

    // Fall back to cargo-installed or PATH
    let candidates = [
        format!("{}/.cargo/bin/ch57x-keyboard-tool",
            std::env::var("HOME").unwrap_or_default()),
        "/usr/local/bin/ch57x-keyboard-tool".to_string(),
        "/opt/homebrew/bin/ch57x-keyboard-tool".to_string(),
        "ch57x-keyboard-tool".to_string(),
    ];

    for path in &candidates {
        if std::path::Path::new(path).exists() || path == "ch57x-keyboard-tool" {
            return Ok(path.clone());
        }
    }

    Err("ch57x-keyboard-tool not found. Run: cargo install ch57x-keyboard-tool".to_string())
}

fn build_yaml(config: &MacropadConfig) -> String {
    let keys: Vec<String> = config.keys.iter()
        .map(|k| format!("\"{}\"", k.value))
        .collect();

    format!(
        "orientation: normal\nrows: 1\ncolumns: 3\nknobs: 1\n\nlayers:\n  - buttons:\n      - [{}]\n    knobs:\n      - cw: {}\n        ccw: {}\n        press: {}\n",
        keys.join(", "),
        config.knob.cw,
        config.knob.ccw,
        config.knob.press,
    )
}