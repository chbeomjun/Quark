"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GravityObject = void 0;
const gl_matrix_1 = require("gl-matrix");
const game_object_1 = require("../game_object");
const mesh_loader_1 = require("../loader/mesh_loader");
class GravityObject extends game_object_1.GameObject {
    velocity;
    acceleration;
    gravity = -9.81;
    constructor(mesh) {
        super(mesh);
        this.velocity = gl_matrix_1.vec3.create(); // Initializes with 0,0,0 
        this.acceleration = gl_matrix_1.vec3.fromValues(0, this.gravity, 0); // Assuming gravity is -9.81 m/s^2 on the Y axis
    }
    static async create(options) {
        let mesh;
        if (options.modelData && options.modelType !== undefined) {
            mesh = await (0, mesh_loader_1.loadMesh)(options.modelData, options.modelType, options.shaderProgram);
        }
        else {
            throw new Error('GravityObject must be initialized with model data and model type.');
        }
        return new GravityObject(mesh);
    }
    tick(deltaTime) {
        // Apply gravity to velocity
        gl_matrix_1.vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, deltaTime);
        // Update position based on velocity
        gl_matrix_1.vec3.scaleAndAdd(this.position, this.position, this.velocity, deltaTime);
        // You can also call `super.update()` here if the parent GameObject class's update function has meaningful behavior.
        super.update();
    }
}
exports.GravityObject = GravityObject;
