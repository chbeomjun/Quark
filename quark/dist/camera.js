"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const gl_matrix_1 = require("gl-matrix");
class Camera {
    position;
    rotation;
    scale;
    fov;
    aspectRatio;
    near;
    far;
    gl;
    shaderProgram = null;
    defaultShaderProgram = null;
    constructor(fov, aspectRatio, near, far, canvas, defaultShaderProgram) {
        this.position = gl_matrix_1.vec3.create();
        this.rotation = gl_matrix_1.vec3.create();
        this.scale = gl_matrix_1.vec3.fromValues(1, 1, 1);
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;
        this.gl = this.createWebGLContext(canvas);
        if (defaultShaderProgram) {
            this.defaultShaderProgram = defaultShaderProgram;
        }
        else {
            // default shaders
            const vertexShaderCode = `
      attribute vec3 a_position;
      attribute vec3 a_normal;
      attribute vec4 a_color;

      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_projection;

      varying vec4 v_color;

      void main() {
        gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
        v_color = a_color;
      }
      `;
            const fragmentShaderCode = `
        precision mediump float;

        varying vec4 v_color;

        void main() {
          gl_FragColor = v_color;
        }
      `;
            const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderCode);
            const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderCode);
            this.defaultShaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader);
        }
    }
    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error('Unable to create WebGL shader.');
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader) || '');
        }
        return shader;
    }
    createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        if (!program) {
            throw new Error('Unable to create WebGL program.');
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program) || '');
        }
        return program;
    }
    createWebGLContext(canvas) {
        const gl = canvas.getContext('webgl');
        if (!gl) {
            throw new Error('Unable to create WebGL context.');
        }
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        return gl;
    }
    setViewport(width, height) {
        this.gl.canvas.width = width;
        this.gl.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
        this.aspectRatio = width / height;
    }
    getViewMatrix() {
        const viewMatrix = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.rotateX(viewMatrix, viewMatrix, this.rotation[0]);
        gl_matrix_1.mat4.rotateY(viewMatrix, viewMatrix, this.rotation[1]);
        gl_matrix_1.mat4.rotateZ(viewMatrix, viewMatrix, this.rotation[2]);
        gl_matrix_1.mat4.translate(viewMatrix, viewMatrix, gl_matrix_1.vec3.negate(gl_matrix_1.vec3.create(), this.position));
        return viewMatrix;
    }
    getProjectionMatrix() {
        const projectionMatrix = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.perspective(projectionMatrix, this.fov, this.aspectRatio, this.near, this.far);
        return projectionMatrix;
    }
}
exports.Camera = Camera;
