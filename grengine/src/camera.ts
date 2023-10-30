import { vec3, mat4 } from 'gl-matrix';

export class Camera {
  public position: vec3;
  public rotation: vec3;
  public scale: vec3;
  public fov: number;
  public aspectRatio: number;
  public near: number;
  public far: number;
  public gl: WebGLRenderingContext;
  public shaderProgram: WebGLProgram | null = null;

  constructor(fov: number, aspectRatio: number, near: number, far: number, canvas: HTMLCanvasElement) {
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.fov = fov;
    this.aspectRatio = aspectRatio;
    this.near = near;
    this.far = far;
    this.gl = this.createWebGLContext(canvas);
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

    this.shaderProgram = shaderProgram;
    return shaderProgram;
  }

  private createWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('Unable to create WebGL context.');
    }
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    return gl;
  }

  public setViewport(width: number, height: number): void {
    this.gl.canvas.width = width;
    this.gl.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    this.aspectRatio = width / height;
  }     
  

  public getViewMatrix(): mat4 {
    const viewMatrix = mat4.create();
    mat4.rotateX(viewMatrix, viewMatrix, this.rotation[0]);
    mat4.rotateY(viewMatrix, viewMatrix, this.rotation[1]);
    mat4.rotateZ(viewMatrix, viewMatrix, this.rotation[2]);
    mat4.translate(viewMatrix, viewMatrix, vec3.negate(vec3.create(), this.position));
    return viewMatrix;
  }

  getProjectionMatrix(): mat4 {
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, this.fov, this.aspectRatio, this.near, this.far);
    return projectionMatrix;
  }
}
