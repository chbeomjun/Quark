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
    constructor(fov, aspectRatio, near, far) {
        this.position = gl_matrix_1.vec3.create();
        this.rotation = gl_matrix_1.vec3.create();
        this.scale = gl_matrix_1.vec3.fromValues(1, 1, 1);
        this.fov = fov;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;
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
