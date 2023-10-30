"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaLight = exports.DirectionalLight = exports.Light = void 0;
const gl_matrix_1 = require("gl-matrix");
const abstract_object_1 = require("./abstract_object");
class Light extends abstract_object_1.AbstractObject {
    color;
    intensity;
    constructor(color, intensity) {
        super();
        this.intensity = intensity;
        this.color = color;
    }
}
exports.Light = Light;
class DirectionalLight extends Light {
    constructor(color, intensity) {
        super(color, intensity);
    }
    getDirection() {
        const direction = gl_matrix_1.vec3.create();
        const rotationQuat = gl_matrix_1.quat.normalize(gl_matrix_1.quat.create(), this.rotation);
        const directionVec4 = gl_matrix_1.vec4.fromValues(0, 0, -1, 1);
        gl_matrix_1.vec3.transformQuat(direction, directionVec4.slice(0, 3), rotationQuat);
        return direction;
    }
}
exports.DirectionalLight = DirectionalLight;
class AreaLight extends Light {
    position;
    size;
    constructor(color, intensity, position, size) {
        super(color, intensity);
        this.position = position;
        this.size = size;
    }
}
exports.AreaLight = AreaLight;
