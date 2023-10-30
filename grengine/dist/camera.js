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
    constructor(fov, aspectRatio, near, far, canvas) {
        this.position = gl_matrix_1.vec3.create();
        this.rotation = gl_matrix_1.vec3.create();
        this.scale = gl_matrix_1.vec3.fromValues(1, 1, 1);
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;
        this.gl = this.createWebGLContext(canvas);
    }
    createShaderProgram(vertexShaderCode, fragmentShaderCode) {
        const gl = this.gl;
        const createShader = (type, source) => {
            const shader = gl.createShader(type);
            if (!shader) {
                throw new Error('Unable to create a shader.');
            }
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const error = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error('Failed to compile the shader: ' + error);
            }
            return shader;
        };
        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderCode);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderCode);
        const shaderProgram = gl.createProgram();
        if (!shaderProgram) {
            throw new Error('Unable to create the shader program.');
        }
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            const error = gl.getProgramInfoLog(shaderProgram);
            throw new Error('Failed to link the shader program: ' + error);
        }
        this.shaderProgram = shaderProgram;
        return shaderProgram;
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
