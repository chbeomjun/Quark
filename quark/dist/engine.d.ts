import { Camera } from './camera';
import { GameObject } from './game_object';
import { Light } from './light';
import { ModelType } from './loader/mesh_loader';
export declare class Engine {
    private static instance;
    cameras: Camera[];
    gameObjects: GameObject[];
    MAX_LIGHTS: Number;
    lights: Light[];
    createLight<T extends Light>(light: T): T;
    removeLight(light: Light): void;
    private constructor();
    static init(): Engine;
    addCamera(camera: Camera): void;
    removeCamera(camera: Camera): void;
    startGameLoop(): void;
    private createWebGLContext;
    createGameObject(options: {
        modelData: string | ArrayBuffer | {
            vertices: number[];
            normals: number[];
        };
        modelType: ModelType;
        shaderProgram?: WebGLProgram;
    }): Promise<GameObject>;
    destroy(gameObject: GameObject): void;
    update(): void;
    private render;
}
