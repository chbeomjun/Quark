use assimp::{Importer, Scene, Node, NodeTrait, Channel};
use nalgebra::{Matrix4, Vector3};
use std::path::Path;
use crate::primitives::Primitive;

pub struct FBXLoader {
    scene: Scene,
}

impl FBXLoader {
    pub fn new(file_path: &str) -> Self {
        let importer = Importer::new();
        let scene = importer.read_file(&Path::new(file_path)).expect("Failed to load FBX file");
        FBXLoader { scene }
    }

    pub fn load_game_object(&self) -> Result<Vec<Box<dyn Primitive>>, String> {
        let root_node = self.scene.root_node();

        let mut game_objects: Vec<Box<dyn Primitive>> = Vec::new();
        Self::load_node_recursively(root_node, &mut game_objects)?;

        Ok(game_objects)
    }

    fn load_node_recursively(node: &Node, game_objects: &mut Vec<Box<dyn Primitive>>) -> Result<(), String> {
        if let Some(mesh_id) = node.meshes().get(0) {
            let mesh = node.mesh(*mesh_id).ok_or("Failed to retrieve mesh")?;
            let primitive = Primitive::from_mesh(mesh)?;
            game_objects.push(primitive);
        }

        for child in node.children() {
            Self::load_node_recursively(child, game_objects)?;
        }

        Ok(())
    }
}
