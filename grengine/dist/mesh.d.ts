export declare class Mesh {
    vertices: number[];
    normals: number[];
    shaderProgram: WebGLProgram | null;
    constructor(vertices: number[], normals: number[], shaderProgram?: WebGLProgram | null);
}
