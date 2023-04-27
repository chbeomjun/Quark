import { vec3, mat4 } from 'gl-matrix';
export declare class Camera {
    position: vec3;
    rotation: vec3;
    scale: vec3;
    fov: number;
    aspectRatio: number;
    near: number;
    far: number;
    constructor(fov: number, aspectRatio: number, near: number, far: number);
    getViewMatrix(): mat4;
    getProjectionMatrix(): mat4;
}
