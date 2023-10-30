// mesh_loader.ts
import { Mesh } from '../mesh';
import { loadObj } from './obj_loader'; // Import loadObj from fbx_loader.ts, which contains loadObj function
// import { loadFbx } from './fbx_loader';
import { GameObject } from '../game_object';

export enum ModelType { 
  OBJ,
  FBX,
  Vertex,
}

export async function loadMesh(
  modelData: string | ArrayBuffer | { vertices: number[]; normals: number[] },
  modelType: ModelType,
  shaderProgram?: WebGLProgram
): Promise<Mesh> {
  let mesh: Mesh;

  switch (modelType) {
    case ModelType.OBJ:
      if (typeof modelData === 'string') {
        mesh = await loadObj(modelData);
      } else {
        throw new Error('Invalid data type for OBJ model. Expected a string.');
      }
      break;

    // case ModelType.FBX:
    //   if (modelData instanceof ArrayBuffer) {
    //     mesh = await loadFbx(modelData);
    //   } else {
    //     throw new Error('Invalid data type for FBX model. Expected an ArrayBuffer.');
    //   }
    //   break;

    case ModelType.Vertex:
      if (typeof modelData === 'object' && 'vertices' in modelData && 'normals' in modelData) {
        mesh = new Mesh(modelData.vertices, modelData.normals, shaderProgram);
      } else {
        throw new Error('Invalid data type for Vertex model. Expected an object with vertices and normals.');
      }
      break;

    default:
      throw new Error('Invalid model type.');
  }
  console.log(mesh);
  return mesh;
}
