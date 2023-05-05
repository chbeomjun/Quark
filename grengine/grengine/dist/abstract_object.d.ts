import { mat4, quat, vec3 } from "gl-matrix";
export declare abstract class AbstractObject {
    position: vec3;
    rotation: quat;
    scale: vec3;
    constructor();
    getModelMatrix(): mat4;
}
