// game_object.rs
use crate::vector3::Vector3;
use crate::transform::Transform;

pub struct GameObject {
    pub mesh: Mesh,
    pub transform: Transform,
}

impl GameObject {
    pub fn from_vertices(vertices: Vec<Vector3>) -> Self {
        let mesh = Mesh::from_vertices(vertices);
        let position = Vector3::new(0.0, 0.0, 0.0);
        let rotation = Vector3::new(0.0, 0.0, 0.0);
        let scale = Vector3::uniform(1.0);
        let transform = Transform::new(position, rotation, scale);

        Self { mesh, transform }
    }

    pub fn from_fbx(fbx_path: &str) -> Self {
        let mesh = Mesh::from_fbx(fbx_path);
        let position = Vector3::new(0.0, 0.0, 0.0);
        let rotation = Vector3::new(0.0, 0.0, 0.0);
        let scale = Vector3::uniform(1.0);
        let transform = Transform::new(position, rotation, scale);

        Self { mesh, transform }
    }
}

pub struct Mesh {
    vertices: Vec<Vector3>,
}

impl Mesh {
    fn from_vertices(vertices: Vec<Vector3>) -> Self {
        Self { vertices }
    }

    fn from_fbx(fbx_path: &str) -> Self {
        // Load FBX file and convert it to a list of vertices.
        // For simplicity, we assume the FBX loading function is already implemented.
        let vertices = load_fbx(fbx_path);
        Self { vertices }
    }
}
