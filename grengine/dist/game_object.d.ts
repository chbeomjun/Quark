import { Mesh } from './mesh';
import { AbstractObject } from './abstract_object';
import { ModelType } from './loader/mesh_loader';
export declare class GameObject extends AbstractObject {
    mesh: Mesh;
    protected constructor(mesh: Mesh);
    static create(options: {
        modelData: string | ArrayBuffer | {
            vertices: number[];
            normals: number[];
        };
        modelType: ModelType;
        shaderProgram?: WebGLProgram;
    }): Promise<GameObject>;
    update(): void;
    setUniformScale(scale: number): void;
}
