"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mesh = void 0;
class Mesh {
    vertices;
    normals;
    colors;
    shaderProgram;
    constructor(vertices, normals, colors, shaderProgram = null) {
        this.vertices = vertices;
        this.normals = normals;
        this.colors = colors;
        this.shaderProgram = shaderProgram;
    }
}
exports.Mesh = Mesh;
