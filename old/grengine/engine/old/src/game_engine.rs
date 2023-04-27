use crate::game_object::GameObject;
use std::collections::HashMap;
use web_sys::WebGlRenderingContext as GL;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::window;

pub struct GameEngine {
    game_objects: HashMap<u32, GameObject>,
    gl: GL,
}

impl GameEngine {
    pub fn new(gl: GL) -> Self {
        GameEngine {
            game_objects: HashMap::new(),
            gl,
        }
    }

    pub fn add_game_object(&mut self, game_object: GameObject) {
        let id = game_object.get_id();
        self.game_objects.insert(id, game_object);
    }

    pub fn remove_game_object(&mut self, id: u32) {
        self.game_objects.remove(&id);
    }

    pub fn on_frame(&mut self) {
        for game_object in self.game_objects.values_mut() {
            game_object.update();
        }
    }

    pub fn run(&mut self) {
        let window = window().unwrap();
        let closure = Closure::wrap(Box::new(move || self.on_frame()) as Box<dyn FnMut()>);
        window.set_interval_with_callback_and_timeout_and_arguments_0(closure.as_ref().unchecked_ref(), 1000.0 / 60.0).unwrap();
        closure.forget();
    }
}
