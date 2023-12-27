"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractObject = void 0;
const gl_matrix_1 = require("gl-matrix");
class AbstractObject {
    position;
    rotation;
    scale;
    constructor() {
        this.position = gl_matrix_1.vec3.create();
        this.rotation = gl_matrix_1.quat.create();
        this.scale = gl_matrix_1.vec3.fromValues(1, 1, 1);
    }
    getModelMatrix() {
        const modelMatrix = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.fromRotationTranslationScale(modelMatrix, this.rotation, this.position, this.scale);
        return modelMatrix;
    }
}
exports.AbstractObject = AbstractObject;
