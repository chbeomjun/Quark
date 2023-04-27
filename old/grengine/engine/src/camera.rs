// camera.rs
use crate::vector3::Vector3;
use crate::transform::Transform;

pub struct Camera {
    pub fov: f32,
    pub transform: Transform,
}

impl Camera {
    pub fn new(fov: f32) -> Self {
        let position = Vector3::new(0.0, 0.0, 0.0);
        let rotation = Vector3::new(0.0, 0.0, 0.0);
        let scale = Vector3::uniform(1.0);
        let transform = Transform::new(position, rotation, scale);

        Self { fov, transform }
    }
}
