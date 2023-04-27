import { vec3 } from 'gl-matrix';
import { Mesh } from './mesh';
export declare class GameObject {
    position: vec3;
    rotation: vec3;
    scale: vec3;
    mesh: Mesh;
    private constructor();
    static create(options: {
        fbx?: ArrayBuffer;
        vertices?: number[];
        normals?: number[];
        shaderProgram?: WebGLProgram;
    }): Promise<GameObject>;
    update(): void;
    setUniformScale(scale: number): void;
}
