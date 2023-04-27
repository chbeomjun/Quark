use engine::game_engine::GameEngine;
use engine::game_object::GameObject;
use wasm_bindgen::prelude::*;
use web_sys::WebGlRenderingContext;

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));

    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    let canvas = document.get_element_by_id("canvas").unwrap();
    let canvas: web_sys::HtmlCanvasElement = canvas.dyn_into::<web_sys::HtmlCanvasElement>().unwrap();
    let gl: WebGlRenderingContext = canvas.get_context("webgl").unwrap().unwrap().dyn_into().unwrap();

    let mut game_engine = GameEngine::new(gl);

    let game_object = GameObject::new(1, "brick.fbx", game_engine.gl.clone()).unwrap();
    game_engine.add_game_object(game_object);

    game_engine.run();

    Ok(())
}
