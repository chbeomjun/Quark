import { Mesh } from '../mesh';
export declare enum ModelType {
    OBJ = 0,
    FBX = 1,
    Vertex = 2
}
export declare function loadMesh(modelData: string | ArrayBuffer | {
    vertices: number[];
    normals: number[];
}, modelType: ModelType, shaderProgram?: WebGLProgram): Promise<Mesh>;
