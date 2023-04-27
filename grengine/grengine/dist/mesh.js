"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesh = void 0;
class Mesh {
    vertices;
    normals;
    shaderProgram;
    constructor(vertices, normals, shaderProgram = null) {
        this.vertices = vertices;
        this.normals = normals;
        this.shaderProgram = shaderProgram;
    }
}
exports.Mesh = Mesh;
