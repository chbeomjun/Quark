use std::collections::{HashSet, HashMap};
use std::cell::Cell;
use std::rc::Rc;
use std::cell::RefCell;

use web_sys::{KeyboardEvent, MouseEvent, TouchEvent, Window};

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;


pub struct Input {
    pressed_keys: Rc<RefCell<HashSet<String>>>,
    mouse_position: Cell<(i32, i32)>,
    mouse_buttons: HashSet<i16>,
    touches: HashMap<i32, (f64, f64)>,
    window: Window,
}

impl Input {
    pub fn new() -> Self {
        let window = web_sys::window().unwrap();
    
        let input = Input {
            pressed_keys: Rc::new(RefCell::new(HashSet::new())),
            mouse_position: Cell::new((0, 0)),
            mouse_buttons: HashSet::new(),
            touches: HashMap::new(),
            window,
        };
    
        input.setup_event_listeners();
    
        input
    }    

    fn setup_event_listeners(&self) {
        let pressed_keys = self.pressed_keys.clone();
        let on_keydown = Closure::wrap(Box::new(move |event: KeyboardEvent| {
            pressed_keys.borrow_mut().insert(event.key());
        }) as Box<dyn FnMut(KeyboardEvent)>);
        self.window
            .add_event_listener_with_callback("keydown", on_keydown.as_ref().unchecked_ref())
            .unwrap();
        on_keydown.forget();
        // ...    

        // Similar setup for "keyup", "mousemove", "mousedown", "mouseup", "touchstart", "touchmove", "touchend" event listeners

        // Set up "keyup" event listener
        // ...

        let mouse_position = self.mouse_position.clone();
        let on_mousemove = Closure::wrap(Box::new(move |event: MouseEvent| {
            mouse_position.set((event.client_x(), event.client_y()));
        }) as Box<dyn FnMut(MouseEvent)>);
        self.window
            .add_event_listener_with_callback("mousemove", on_mousemove.as_ref().unchecked_ref())
            .unwrap();
        on_mousemove.forget();

        // Set up "mousedown" and "mouseup" event listeners
        // ...

        // let touches = self.touches.clone();
        // let on_touchstart = Closure::wrap(Box::new(move |event: TouchEvent| {
        //     event.prevent_default();
        //     for i in 0..event.changed_touches().length() {
        //         if let Some(touch) = event.changed_touches().get(i) {
        //             touches.insert(touch.identifier(), (touch.client_x() as f64, touch.client_y() as f64));
        //         }
        //     }
        // }) as Box<dyn FnMut(TouchEvent)>);
        // self.window
        //     .add_event_listener_with_callback("touchstart", on_touchstart.as_ref().unchecked_ref())
        //     .unwrap();
        // on_touchstart.forget();

        // Set up "touchmove" and "touchend" event listeners
        // ...
    }

    pub fn is_key_pressed(&self, key: &str) -> bool {
        self.pressed_keys.borrow().contains(key)
    }

    pub fn get_mouse_position(&self) -> (i32, i32) {
        self.mouse_position.get()
    }

    pub fn is_mouse_button_pressed(&self, button: i16) -> bool {
        self.mouse_buttons.contains(&button)
    }
    

    // pub fn get_touches(&self) -> &HashMap<i32, (f64, f64)> {
    //     &self.touches
    // }
}
