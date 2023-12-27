"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const gl_matrix_1 = require("gl-matrix");
const abstract_object_1 = require("./abstract_object");
const mesh_loader_1 = require("./loader/mesh_loader");
class GameObject extends abstract_object_1.AbstractObject {
    mesh;
    constructor(mesh) {
        super();
        this.position = gl_matrix_1.vec3.create();
        this.rotation = gl_matrix_1.quat.create();
        this.scale = gl_matrix_1.vec3.fromValues(1, 1, 1);
        this.mesh = mesh;
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
        this.mesh.shaderProgram = shaderProgram;
        return shaderProgram;
    }
    static async create(options) {
        let mesh;
        if (options.modelData && options.modelType !== undefined) {
            mesh = await (0, mesh_loader_1.loadMesh)(options.modelData, options.modelType, options.shaderProgram);
        }
        else {
            throw new Error('GameObject must be initialized with model data and model type.');
        }
        return new GameObject(mesh);
    }
    update() {
        // This method can be overridden in derived classes, called onframe when a gameobject is not culled.
    }
    setUniformScale(scale) {
        this.scale = gl_matrix_1.vec3.fromValues(scale, scale, scale);
    }
}
exports.GameObject = GameObject;
