import { quat, vec3 } from 'gl-matrix';
import { Mesh } from './mesh';
import { Engine } from './engine';
import { AbstractObject } from './abstract_object';
import { ModelType, loadMesh } from './loader/mesh_loader';

export class GameObject extends AbstractObject {
  public mesh: Mesh;

  protected constructor(mesh: Mesh) {
    super();
    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.mesh = mesh;
  }

  public static async create(options: {
    modelData: string | ArrayBuffer | { vertices: number[]; normals: number[] };
    modelType: ModelType;
    shaderProgram?: WebGLProgram;
  }): Promise<GameObject> {
    let mesh: Mesh;
  
    if (options.modelData && options.modelType !== undefined) {
      mesh = await loadMesh(options.modelData, options.modelType, options.shaderProgram);
    } else {
      throw new Error('GameObject must be initialized with model data and model type.');
    }
  
    return new GameObject(mesh);
  }  

  public update(): void {
    // This method can be overridden in derived classes to update the GameObject.
  }

  public setUniformScale(scale: number): void {
    this.scale = vec3.fromValues(scale, scale, scale);
  }
}
