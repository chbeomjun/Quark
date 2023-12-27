import { GameObject } from "../game_object";
import { ModelType } from "../loader/mesh_loader";

class CubeGameObject extends GameObject {
    private vertices = [
      // Front face
      -1, -1,  1,
       1, -1,  1,
       1,  1,  1,
       1,  1,  1,
      -1,  1,  1,
      -1, -1,  1,
  
      // Back face
      -1, -1, -1,
      -1,  1, -1,
       1,  1, -1,
       1,  1, -1,
       1, -1, -1,
      -1, -1, -1,
  
      // Top face
      -1,  1, -1,
      -1,  1,  1,
       1,  1,  1,
       1,  1,  1,
       1,  1, -1,
      -1,  1, -1,
  
      // Bottom face
      -1, -1, -1,
       1, -1, -1,
       1, -1,  1,
       1, -1,  1,
      -1, -1,  1,
      -1, -1, -1,
  
      // Right face
       1, -1, -1,
       1,  1, -1,
       1,  1,  1,
       1,  1,  1,
       1, -1,  1,
       1, -1, -1,
  
      // Left face
      -1, -1, -1,
      -1, -1,  1,
      -1,  1,  1,
      -1,  1,  1,
      -1,  1, -1,
      -1, -1, -1
    ];
  
    private normals = [
      // Front face
       0,  0,  1,
       0,  0,  1,
       0,  0,  1,
       0,  0,  1,
       0,  0,  1,
       0,  0,  1,
  
      // Back face
       0,  0, -1,
       0,  0, -1,
       0,  0, -1,
       0,  0, -1,
       0,  0, -1,
       0,  0, -1,
  
      // Top face
       0,  1,  0,
       0,  1,  0,
       0,  1,  0,
       0,  1,  0,
       0,  1,  0,
       0,  1,  0,
  
      // Bottom face
        0, -1,  0,
        0, -1,  0,
        0, -1,  0,
        0, -1,  0,
        0, -1,  0,
        0, -1,  0,
  
      // Right face
        1,  0,  0,
        1,  0,  0,
        1,  0,  0,
        1,  0,  0,
        1,  0,  0,
        1,  0,  0,
  
      // Left face
      -1,  0,  0,
      -1,  0,  0,
      -1,  0,  0,
      -1,  0,  0,
      -1,  0,  0,
      -1,  0,  0
    ];
  
    constructor() {
      super({
          modelData: { vertices: this.vertices, normals: this.normals },
          modelType: ModelType.Vertex,
      });
  
      this.position[2] = 10;
    }
  }