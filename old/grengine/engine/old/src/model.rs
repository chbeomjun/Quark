use web_sys::{WebGlRenderingContext as GL, WebGlProgram};
use nalgebra::{Matrix4};
use wasm_bindgen::JsCast;
use crate::fbx_loader::{FBXLoader, load_fbx_data};
use std::fs::File;
use std::io::Read;
use crate::utils::{compile_shader, link_program};
use js_sys;

pub struct FbxModel {
    gl: GL,
    program: WebGlProgram,
    vertex_buffer: WebGlBuffer,
    index_buffer: WebGlBuffer,
    num_indices: i32,
    model_matrix_location: WebGlUniformLocation,
}

impl FbxModel {
    pub fn from_file(gl: &GL, file_path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        // Load and parse FBX file using FBXLoader
        let fbx_loader = FBXLoader::new(file_path);
        let game_objects = fbx_loader.load_game_object()?;

        // Extract vertices and indices from game_objects
        let vertices = game_objects.iter().flat_map(|primitive| primitive.vertices()).collect::<Vec<_>>();
        let indices = game_objects.iter().flat_map(|primitive| primitive.indices()).collect::<Vec<_>>();

        // Create WebGL rendering context, shaders, and program
        let vert_shader = compile_shader(
            &gl,
            GL::VERTEX_SHADER,
            r#"
            attribute vec4 a_position;
            uniform mat4 u_modelMatrix;
            void main() {
                gl_Position = u_modelMatrix * a_position;
            }
            "#,
        )?;
        let frag_shader = compile_shader(
            &gl,
            GL::FRAGMENT_SHADER,
            r#"
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
            "#,
        )?;
        let program = link_program(&gl, &vert_shader, &frag_shader)?;

        // Process the FBX data and create vertex and index buffers
        let vertex_buffer = gl.create_buffer().ok_or("Failed to create vertex buffer")?;
        gl.bind_buffer(GL::ARRAY_BUFFER, Some(&vertex_buffer));
        unsafe {
            let vert_array = js_sys::Float32Array::view(&vertices);
            gl.buffer_data_with_array_buffer_view(GL::ARRAY_BUFFER, &vert_array, GL::STATIC_DRAW);
        }

        let index_buffer = gl.create_buffer().ok_or("Failed to create index buffer")?;
        gl.bind_buffer(GL::ELEMENT_ARRAY_BUFFER, Some(&index_buffer));
        unsafe {
            let ind_array = js_sys::Uint16Array::view(&indices);
            gl.buffer_data_with_array_buffer_view(GL::ELEMENT_ARRAY_BUFFER, &ind_array, GL::STATIC_DRAW);
        }

        let num_indices = indices.len() as i32;
        let model_matrix_location = gl.get_uniform_location(&program, "u_modelMatrix")
            .ok_or("Failed to get uniform location for model matrix")?;

        Ok(FbxModel {
            gl: gl.clone(),
            program,
            vertex_buffer,
            index_buffer,
            num_indices,
            model_matrix_location,
        })
    }

    pub fn render(&self, model_matrix: &Matrix4<f32>) {
        self.gl.use_program(Some(&self.program));

        self.gl.bind_buffer(GL::ARRAY_BUFFER, Some(&self.vertex_buffer));
        self.gl.vertex_attrib_pointer_with_i32(0, 3, GL::FLOAT, false, 0, 0);
        self.gl.enable_vertex_attrib_array(0);
        
        self.gl.bind_buffer(GL::ELEMENT_ARRAY_BUFFER, Some(&self.index_buffer));
    
        self.gl.uniform_matrix4fv_with_f32_array(
            Some(&self.model_matrix_location),
            false,
            model_matrix.as_slice(),
        );
    
        self.gl.draw_elements_with_i32(GL::TRIANGLES, self.num_indices, GL::UNSIGNED_SHORT, 0);
     }
        
}