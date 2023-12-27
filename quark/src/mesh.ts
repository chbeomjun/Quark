export class Mesh {
  public vertices: number[];
  public normals: number[];
  public colors: number[];
  public shaderProgram: WebGLProgram | null;

  constructor(vertices: number[], normals: number[], colors: number[], shaderProgram: WebGLProgram | null = null) {
    this.vertices = vertices;
    this.normals = normals;
    this.colors = colors;
    this.shaderProgram = shaderProgram;
  }
}
 