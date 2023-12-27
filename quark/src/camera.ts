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
  public defaultShaderProgram: WebGLProgram | null = null;

  constructor(fov: number, aspectRatio: number, near: number, far: number, canvas: HTMLCanvasElement, defaultShaderProgram?: WebGLProgram) {
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.fov = fov;
    this.aspectRatio = aspectRatio;
    this.near = near;
    this.far = far;
    this.gl = this.createWebGLContext(canvas);

    if (defaultShaderProgram) {
      this.defaultShaderProgram = defaultShaderProgram;
    } else {
      // default shaders
      const vertexShaderCode = `
      attribute vec3 a_position;
      attribute vec3 a_normal;
      attribute vec4 a_color;

      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_projection;

      varying vec4 v_color;

      void main() {
        gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
        v_color = a_color;
      }
      `;

      const fragmentShaderCode = `
        precision mediump float;

        varying vec4 v_color;

        void main() {
          gl_FragColor = v_color;
        }
      `;

      const vertexShader = this.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderCode);
      const fragmentShader = this.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderCode);

      this.defaultShaderProgram = this.createProgram(this.gl, vertexShader, fragmentShader);
    }
  }

  private createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error('Unable to create WebGL shader.');
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || '');
    }
    return shader;
  }
  
  private createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    if (!program) {
      throw new Error('Unable to create WebGL program.');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || '');
    }
    return program;
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
