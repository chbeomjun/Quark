"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("../game_object");
const mesh_loader_1 = require("../loader/mesh_loader");
class CubeGameObject extends game_object_1.GameObject {
    vertices = [
        // Front face
        -1, -1, 1,
        1, -1, 1,
        1, 1, 1,
        1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        // Back face
        -1, -1, -1,
        -1, 1, -1,
        1, 1, -1,
        1, 1, -1,
        1, -1, -1,
        -1, -1, -1,
        // Top face
        -1, 1, -1,
        -1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, 1, -1,
        -1, 1, -1,
        // Bottom face
        -1, -1, -1,
        1, -1, -1,
        1, -1, 1,
        1, -1, 1,
        -1, -1, 1,
        -1, -1, -1,
        // Right face
        1, -1, -1,
        1, 1, -1,
        1, 1, 1,
        1, 1, 1,
        1, -1, 1,
        1, -1, -1,
        // Left face
        -1, -1, -1,
        -1, -1, 1,
        -1, 1, 1,
        -1, 1, 1,
        -1, 1, -1,
        -1, -1, -1
    ];
    normals = [
        // Front face
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        // Back face
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        // Top face
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        // Bottom face
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        // Right face
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        // Left face
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0
    ];
    constructor() {
        super({
            modelData: { vertices: this.vertices, normals: this.normals },
            modelType: mesh_loader_1.ModelType.Vertex,
        });
        this.position[2] = 10;
    }
}
