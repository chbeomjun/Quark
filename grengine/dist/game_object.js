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
        // This method can be overridden in derived classes to update the GameObject.
    }
    setUniformScale(scale) {
        this.scale = gl_matrix_1.vec3.fromValues(scale, scale, scale);
    }
}
exports.GameObject = GameObject;
