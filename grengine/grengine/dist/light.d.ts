import { vec2, vec3 } from 'gl-matrix';
import { AbstractObject } from "./abstract_object";
export declare abstract class Light extends AbstractObject {
    color: vec3;
    intensity: number;
    constructor(color: vec3, intensity: number);
}
export declare class DirectionalLight extends Light {
    constructor(color: vec3, intensity: number);
    getDirection(): vec3;
}
export declare class AreaLight extends Light {
    position: vec3;
    size: vec2;
    constructor(color: vec3, intensity: number, position: vec3, size: vec2);
}
