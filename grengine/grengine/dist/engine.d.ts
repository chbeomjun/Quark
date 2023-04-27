import { Camera } from './camera';
import { GameObject } from './game_object';
import { Light } from './light';
export declare class Engine {
    private static instance;
    camera: Camera;
    gameObjects: GameObject[];
    gl: WebGLRenderingContext;
    defaultShaderProgram: WebGLProgram;
    MAX_LIGHTS: Number;
    lights: Light[];
    createLight<T extends Light>(light: T): T;
    removeLight(light: Light): void;
    private constructor();
    static init(canvas: HTMLCanvasElement, camera: Camera): Engine;
    startGameLoop(): void;
    private createWebGLContext;
    private createDefaultShaderProgram;
    private createShader;
    createGameObject(options: {
        fbx?: ArrayBuffer;
        vertices?: number[];
        shaderProgram?: WebGLProgram;
        normals?: number[];
    }): Promise<GameObject>;
    destroy(gameObject: GameObject): void;
    update(): void;
    setViewport(width: number, height: number): void;
    private render;
}
