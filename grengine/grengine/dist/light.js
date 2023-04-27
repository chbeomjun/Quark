"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaLight = exports.DirectionalLight = exports.Light = void 0;
const gl_matrix_1 = require("gl-matrix");
const game_object_1 = require("./game_object");
class Light extends game_object_1.GameObject {
    color;
    intensity;
    constructor(color, intensity) {
        super();
        this.color = color;
        this.intensity = intensity;
    }
}
exports.Light = Light;
class DirectionalLight extends Light {
    constructor(color, intensity) {
        super(color, intensity);
    }
    getDirection() {
        const direction = gl_matrix_1.vec3.create();
        gl_matrix_1.vec3.transformQuat(direction, gl_matrix_1.vec3.fromValues(0, 0, -1), this.rotation);
        return direction;
    }
}
exports.DirectionalLight = DirectionalLight;
class AreaLight extends Light {
    constructor(color, intensity) {
        super(color, intensity);
    }
}
exports.AreaLight = AreaLight;
