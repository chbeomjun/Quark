import { vec3 } from 'gl-matrix';
import { GameObject } from './game_object';
export declare abstract class Light extends GameObject {
    color: vec3;
    intensity: number;
    constructor(color: vec3, intensity: number);
}
export declare class DirectionalLight extends Light {
    constructor(color: vec3, intensity: number);
    getDirection(): vec3;
}
export declare class AreaLight extends Light {
    constructor(color: vec3, intensity: number);
}
