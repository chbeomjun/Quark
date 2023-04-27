import { vec3 } from 'gl-matrix';
import { Mesh } from './mesh';
import { Engine } from './engine';
import { loadFbx } from './fbx_loader';

export class GameObject {
  public position: vec3;
  public rotation: vec3;
  public scale: vec3;
  public mesh: Mesh;

  private constructor(mesh: Mesh) {
    
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.mesh = mesh;
  }

  public static async create(options: { fbx?: ArrayBuffer; vertices?: number[]; normals?: number[]; shaderProgram?: WebGLProgram }): Promise<GameObject> {

    let mesh: Mesh;
  
    if (options.fbx) {
      const fbxMesh = await loadFbx(options.fbx);
      mesh = new Mesh(fbxMesh.vertices, fbxMesh.normals, options.shaderProgram);
    } else if (options.vertices) {
      if (options.normals == undefined) {
        throw new Error('Normal must be passed.')
      }
      mesh = new Mesh(options.vertices, options.normals, options.shaderProgram);
    } else {
      throw new Error('GameObject must be initialized with either FBX data or a list of vertices.');
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
