// transform.rs
use crate::vector3::Vector3;

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Transform {
    pub position: Vector3,
    pub rotation: Vector3,
    pub scale: Vector3,
}

impl Transform {
    pub fn new(position: Vector3, rotation: Vector3, scale: Vector3) -> Self {
        Self {
            position,
            rotation,
            scale,
        }
    }
}
