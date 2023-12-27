export declare class Mesh {
    vertices: number[];
    normals: number[];
    colors: number[];
    shaderProgram: WebGLProgram | null;
    constructor(vertices: number[], normals: number[], colors: number[], shaderProgram?: WebGLProgram | null);
}
