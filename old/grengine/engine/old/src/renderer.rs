use crate::game_object::GameObject;
use web_sys::{WebGlRenderingContext as GL, WebGlProgram, WebGlShader};
use crate::utils::{create_program, create_shader};


pub struct Renderer {
    gl: GL,
    program: WebGlProgram,
    position_attribute_location: u32,
    color_uniform_location: WebGlUniformLocation,
    model_matrix_uniform_location: WebGlUniformLocation,
}

impl Renderer {
    pub fn new(gl: GL) -> Result<Self, String> {
        let vertex_shader = compile_shader(
            &gl,
            GL::VERTEX_SHADER,
            r#"#version 300 es
            in vec4 a_position;
            uniform mat4 u_model_matrix;
            void main() {
                gl_Position = u_model_matrix * a_position;
            }
            "#,
        )?;

        let fragment_shader = compile_shader(
            &gl,
            GL::FRAGMENT_SHADER,
            r#"#version 300 es
            precision highp float;
            uniform vec4 u_color;
            out vec4 out_color;
            void main() {
                out_color = u_color;
            }
            "#,
        )?;

        let program = link_program(&gl, &[&vertex_shader, &fragment_shader])?;

        let position_attribute_location = gl.get_attrib_location(&program, "a_position") as u32;
        let color_uniform_location = gl.get_uniform_location(&program, "u_color");
        let model_matrix_uniform_location = gl.get_uniform_location(&program, "u_model_matrix");

        Ok(Self {
            gl,
            program,
            position_attribute_location,
            color_uniform_location: color_uniform_location.unwrap(),
            model_matrix_uniform_location: model_matrix_uniform_location.unwrap(),
        })
    }

    pub fn render_game_object(&self, game_object: &GameObject) {
        let gl = &self.gl;

        // Create and bind the vertex buffer
        let vertex_buffer = gl.create_buffer().unwrap();
        gl.bind_buffer(GL::ARRAY_BUFFER, Some(&vertex_buffer));

        // Set the buffer data
        let vertex_data = game_object.fbx_data.clone();
        gl.buffer_data_with_array_buffer_view(GL::ARRAY_BUFFER, &vertex_data, GL::STATIC_DRAW);

        // Set up the vertex attribute pointer
        gl.vertex_attrib_pointer_with_i32(
            self.position_attribute_location,
            3,
            GL::FLOAT,
            false,
            0,
            0,
        );
        gl.enable_vertex_attrib_array(self.position_attribute_location);

        // Set up the color uniform
        gl.uniform4fv_with_f32_array(Some(&self.color_uniform_location), &game_object.color);

        // Set up the model matrix uniform
        gl.uniform_matrix4fv_with_f32_array(
            Some(&self.model_matrix_uniform_location),
            false,
            game_object.model_matrix.as_slice(),
        );

        // Draw the object
        gl.draw_arrays(GL::TRIANGLES, 0, (vertex_data.len() / 12) as i32);
    }
}

fn compile_shader(gl: &GL, shader_type: u32, source: &str) -> Result<WebGlShader, String> {
    let shader = gl
        .create_shader(shader_type)
        .ok_or_else(|| String::from("Unable to create shader object"))?;
    fn glshader(gl: &GL, shader_type: u32, source: &str) -> Result<WebGlShader, String> {
        let shader = gl
        .create_shader(shader_type)
        .ok_or_else(|| String::from("Unable to create shader object"))?;
        gl.shader_source(&shader, source);
        gl.compile_shader(&shader);
        
        
        if gl.get_shader_parameter(&shader, GL::COMPILE_STATUS).as_bool().unwrap_or(false) {
            Ok(shader)
        } else {
            Err(gl.get_shader_info_log(&shader).unwrap_or_else(|| String::from("Unknown error creating shader")))
        }
        
        }
        
        fn link_program(gl: &GL, shaders: &[&WebGlShader]) -> Result<WebGlProgram, String> {
        let program = gl
        .create_program()
        .ok_or_else(|| String::from("Unable to create shader object"))?;
        
        
        for shader in shaders {
            gl.attach_shader(&program, shader);
        }
        
        gl.link_program(&program);
        
        if gl.get_program_parameter(&program, GL::LINK_STATUS).as_bool().unwrap_or(false) {
            Ok(program)
        } else {
            Err(gl.get_program_info_log(&program).unwrap_or_else(|| String::from("Unknown error linking program")))
        }
        
        }
    }