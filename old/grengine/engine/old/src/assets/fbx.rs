use std::fs;
use std::path::Path;

pub fn load_fbx_data(filename: &str) -> Result<Vec<u8>, String> {
    let path = Path::new(filename);

    if !path.exists() {
        return Err(format!("FBX file '{}' does not exist", filename));
    }

    let data = fs::read(path).map_err(|e| format!("Error reading FBX file: {}", e))?;
    Ok(data)
}
