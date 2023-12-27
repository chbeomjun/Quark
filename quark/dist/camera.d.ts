import { vec3, mat4 } from 'gl-matrix';
export declare class Camera {
    position: vec3;
    rotation: vec3;
    scale: vec3;
    fov: number;
    aspectRatio: number;
    near: number;
    far: number;
    gl: WebGLRenderingContext;
    shaderProgram: WebGLProgram | null;
    defaultShaderProgram: WebGLProgram | null;
    constructor(fov: number, aspectRatio: number, near: number, far: number, canvas: HTMLCanvasElement, defaultShaderProgram?: WebGLProgram);
    private createShader;
    private createProgram;
    private createWebGLContext;
    setViewport(width: number, height: number): void;
    getViewMatrix(): mat4;
    getProjectionMatrix(): mat4;
}
