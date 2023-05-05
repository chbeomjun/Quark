"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const gl_matrix_1 = require("gl-matrix");
const mesh_1 = require("./mesh");
const fbx_loader_1 = require("./fbx_loader");
const abstract_object_1 = require("./abstract_object");
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
        if (options.fbx) {
            const fbxMesh = await (0, fbx_loader_1.loadFbx)(options.fbx);
            mesh = new mesh_1.Mesh(fbxMesh.vertices, fbxMesh.normals, options.shaderProgram);
        }
        else if (options.vertices) {
            if (options.normals == undefined) {
                throw new Error('Normal must be passed.');
            }
            mesh = new mesh_1.Mesh(options.vertices, options.normals, options.shaderProgram);
        }
        else {
            throw new Error('GameObject must be initialized with either FBX data or a list of vertices.');
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
