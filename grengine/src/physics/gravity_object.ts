import { quat, vec3 } from 'gl-matrix';
import { Mesh } from '../mesh';
import { GameObject } from '../game_object';
import { ModelType, loadMesh } from '../loader/mesh_loader';

export class GravityObject extends GameObject {
  public velocity: vec3;
  public acceleration: vec3;
  public gravity: number = -9.81;

  constructor(mesh: Mesh) {
    super(mesh);
    this.velocity = vec3.create(); // Initializes with 0,0,0 
    this.acceleration = vec3.fromValues(0, this.gravity, 0); // Assuming gravity is -9.81 m/s^2 on the Y axis
  }

  public static async create(options: {
    modelData: string | ArrayBuffer | { vertices: number[]; normals: number[] };
    modelType: ModelType;
    shaderProgram?: WebGLProgram;
  }): Promise<GravityObject> {
    let mesh: Mesh;
  
    if (options.modelData && options.modelType !== undefined) {
      mesh = await loadMesh(options.modelData, options.modelType, options.shaderProgram);
    } else {
      throw new Error('GravityObject must be initialized with model data and model type.');
    }
  
    return new GravityObject(mesh);
  }

  public tick(deltaTime: number): void {
    // Apply gravity to velocity
    vec3.scaleAndAdd(this.velocity, this.velocity, this.acceleration, deltaTime);

    // Update position based on velocity
    vec3.scaleAndAdd(this.position, this.position, this.velocity, deltaTime);

    // You can also call `super.update()` here if the parent GameObject class's update function has meaningful behavior.
    super.update();
  }
}
