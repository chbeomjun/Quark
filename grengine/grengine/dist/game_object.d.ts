import { Mesh } from './mesh';
import { AbstractObject } from './abstract_object';
export declare class GameObject extends AbstractObject {
    mesh: Mesh;
    protected constructor(mesh: Mesh);
    static create(options: {
        fbx?: ArrayBuffer;
        vertices?: number[];
        normals?: number[];
        shaderProgram?: WebGLProgram;
    }): Promise<GameObject>;
    update(): void;
    setUniformScale(scale: number): void;
}
