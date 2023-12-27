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

  public createShaderProgram(vertexShaderCode: string, fragmentShaderCode: string): WebGLProgram {
    const gl = this.gl;

    const createShader = (type: GLenum, source: string): WebGLShader => {
      const shader = gl.createShader(type);
      if (!shader) {
        throw new Error('Unable to create a shader.');
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error('Failed to compile the shader: ' + error);
      }

      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderCode);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderCode);

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
      throw new Error('Unable to create the shader program.');
    }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(shaderProgram);
      throw new Error('Failed to link the shader program: ' + error);
    }

    this.mesh.shaderProgram = shaderProgram;
    return shaderProgram;
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
    // This method can be overridden in derived classes, called onframe when a gameobject is not culled.
  }

  public setUniformScale(scale: number): void {
    this.scale = vec3.fromValues(scale, scale, scale);
  }
}
