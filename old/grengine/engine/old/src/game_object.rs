use crate::fbx_loader::FBXLoader;
use crate::renderer::Renderer;
use nalgebra::{Matrix4, Vector3, Unit};
use web_sys::WebGlRenderingContext as GL;

pub struct GameObject {
    id: u32,
    fbx_data: Vec<u8>,
    position: Vector3<f32>,
    rotation: Vector3<f32>,
    scale: Vector3<f32>,
    model_matrix: Matrix4<f32>,
    color: [f32; 4],
    renderer: Renderer,
}

impl GameObject {
    pub fn new(id: u32, fbx_file: &str, gl: GL) -> Result<Self, String> {
        let fbx_data = fbx::load_fbx_data(fbx_file)?;
        let renderer = Renderer::new(gl)?;

        Ok(GameObject {
            id,
            fbx_data: Vec<f32>,
            position: Vector3::zeros(),
            rotation: Vector3::zeros(),
            scale: Vector3::new(1.0, 1.0, 1.0),
            model_matrix: Matrix4::identity(),
            color: [1.0, 1.0, 1.0, 1.0],
            renderer,
        })
    }

    pub fn get_id(&self) -> u32 {
        self.id
    }

    pub fn set_position(&mut self, position: Vector3<f32>) {
        self.position = position;
    }

    pub fn get_position(&self) -> Vector3<f32> {
        self.position
    }

    pub fn set_rotation(&mut self, rotation: Vector3<f32>) {
        self.rotation = rotation;
    }

    pub fn get_rotation(&self) -> Vector3<f32> {
        self.rotation
    }

    pub fn set_scale(&mut self, scale: Vector3<f32>) {
        self.scale = scale;
    }

    pub fn get_scale(&self) -> Vector3<f32> {
        self.scale
    }

    pub fn update(&mut self) {
        self.model_matrix = Matrix4::new_translation(&self.position)
            * Matrix4::from_axis_angle(&Unit::new_normalize(self.rotation.clone()), self.rotation.norm())
            * Matrix4::new_nonuniform_scaling(&self.scale);
        self.renderer.render_game_object(self);
    }
    
    pub fn destroy(self) {
        // The GameObject will be dropped and deallocated when this function returns
    }
    pub fn set_color(&mut self, color: [f32; 4]) {
        self.color = color;
    }


}
