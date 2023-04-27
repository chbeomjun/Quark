export class Mesh {
  public vertices: number[];
  public normals: number[];
  public shaderProgram: WebGLProgram | null;

  constructor(vertices: number[], normals: number[], shaderProgram: WebGLProgram | null = null) {
    this.vertices = vertices;
    this.normals = normals;
    this.shaderProgram = shaderProgram;
  }
}
