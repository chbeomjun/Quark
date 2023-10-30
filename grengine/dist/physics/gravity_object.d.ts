import { vec3 } from 'gl-matrix';
import { Mesh } from '../mesh';
import { GameObject } from '../game_object';
import { ModelType } from '../loader/mesh_loader';
export declare class GravityObject extends GameObject {
    velocity: vec3;
    acceleration: vec3;
    gravity: number;
    constructor(mesh: Mesh);
    static create(options: {
        modelData: string | ArrayBuffer | {
            vertices: number[];
            normals: number[];
        };
        modelType: ModelType;
        shaderProgram?: WebGLProgram;
    }): Promise<GravityObject>;
    tick(deltaTime: number): void;
}
