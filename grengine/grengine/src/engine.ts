import { Camera } from './camera';
import { Mesh } from './mesh';
import { GameObject } from './game_object';
import { mat4, vec3 } from 'gl-matrix';
import { DirectionalLight, Light } from './light';

export class Engine {
  private static instance: Engine;
  public camera: Camera;
  public gameObjects: GameObject[] = [];
  public gl: WebGLRenderingContext;
  public defaultShaderProgram: WebGLProgram;
  public MAX_LIGHTS: Number = 100;
  // Add a new property to store the lights
  public lights: Light[] = [];

  // Add a new method to create and register a light
  public createLight<T extends Light>(light: T): T {
    this.lights.push(light);
    return light;
  }

  // Add a new method to remove a light
  public removeLight(light: Light): void {
    const index = this.lights.indexOf(light);
    if (index !== -1) {
      this.lights.splice(index, 1);
    }
  }


  private constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.gl = this.createWebGLContext(canvas);
    this.defaultShaderProgram = this.createDefaultShaderProgram();
  }

  public static init(canvas: HTMLCanvasElement, camera: Camera): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine(camera, canvas);
    }
    return Engine.instance;
  }

  public startGameLoop(): void {
    const loop = () => {
      this.update();
      requestAnimationFrame(loop);
    };
  
    loop();
  }  

  private createWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('Unable to create WebGL context.');
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    // Query the maximum number of uniform vectors allowed in the fragment shader
    // Pretty sure this depends on system? Not sure about in webgl, but GLES is this way.
    const maxUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    console.log('Max Fragment Uniform Vectors:', maxUniformVectors);

    // automatically set MAX_LIGHTS
    const lightUniformVectors = 3; 
    const otherUniformVectors = 5;
    this.MAX_LIGHTS = Math.floor((maxUniformVectors - otherUniformVectors) / lightUniformVectors);

    return gl;
}


  private createDefaultShaderProgram(): WebGLProgram {
    const vertexShaderCode = `
      attribute vec4 a_position;
      attribute vec3 a_normal;

      uniform mat4 u_model;
      uniform mat4 u_view;
      uniform mat4 u_projection;

      varying vec3 v_normal;

      void main() {
        gl_Position = u_projection * u_view * u_model * a_position;
        v_normal = mat3(u_model) * a_normal; // Transform the normal vector using the model matrix
      }
    `;

    const fragmentShaderCode = `
      precision mediump float;
    
      varying vec3 v_normal;
    
      struct Light {
        vec3 color;
        float intensity;
        vec3 direction;
      };
    
      uniform Light u_lights[${this.MAX_LIGHTS}]; // Set a maximum number of lights
      uniform int u_lightCount;
    
      void main() {
        vec3 normal = normalize(v_normal);
        vec3 baseColor = vec3(1.0, 0.0, 0.0); // Base color (red)
        vec3 finalColor = vec3(0.0, 0.0, 0.0);
    
        for (int i = 0; i < ${this.MAX_LIGHTS}; ++i) { // Use the constant value as the loop limit
          if (i >= u_lightCount) { // Break out of the loop when the index reaches the actual light count
            break;
          }
    
          float lightIntensity = max(dot(normal, u_lights[i].direction), 0.2); // Calculate light intensity with a minimum ambient value
          finalColor += u_lights[i].color * lightIntensity * u_lights[i].intensity;
        }
    
        gl_FragColor = vec4(baseColor * finalColor, 1.0);
      }
    `;
  

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderCode);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderCode);

    const shaderProgram = this.gl.createProgram();
    if (!shaderProgram) {
      throw new Error('Unable to create the default shader program.');
    }
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(shaderProgram);
      throw new Error('Failed to link the default shader program: ' + error);
    }

    return shaderProgram;
  }

  private createShader(type: GLenum, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('Unable to create a shader.');
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error('Failed to compile the shader: ' + error);
    }

    return shader;
  }

  public async createGameObject(options: { fbx?: ArrayBuffer; vertices?: number[]; shaderProgram?: WebGLProgram; normals?: number[] }): Promise<GameObject> {
    // Use the default shader program when none is provided
    options.shaderProgram = options.shaderProgram || this.defaultShaderProgram;
  
    const gameObject = await GameObject.create({
      fbx: options.fbx,
      vertices: options.vertices,
      normals: options.normals,
      shaderProgram: options.shaderProgram
    });
    
    
    this.gameObjects.push(gameObject);
    return gameObject;
  }
  
  

  public destroy(gameObject: GameObject): void {
    const index = this.gameObjects.indexOf(gameObject);
    if (index !== -1) {
      this.gameObjects.splice(index, 1);
    }
  }

  public update(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    for (const gameObject of this.gameObjects) {
      gameObject.update();
      this.render(gameObject);
    }
  
    // Log the lights array
    console.log(this.lights);
  }
  
    
  public setViewport(width: number, height: number): void {
    this.gl.canvas.width = width;
    this.gl.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    this.camera.aspectRatio = width / height;
  }     
      
  private render(gameObject: GameObject): void {
    const mesh = gameObject.mesh;
    const gl = this.gl;
  
    // Create and bind the vertex buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
  
    // Create and bind the normal buffer
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);
  
    // Set up the shader program
    gl.useProgram(mesh.shaderProgram);
  
    if (!mesh.shaderProgram) {
      console.error("Error: Shader program is null.");
      return;
    }
  
    // Set up the position attribute
    const positionAttribute = gl.getAttribLocation(mesh.shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);

  
    // Set up the normal attribute
    const normalAttribute = gl.getAttribLocation(mesh.shaderProgram, 'a_normal');
    gl.enableVertexAttribArray(normalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalAttribute, 3, gl.FLOAT, false, 0, 0);
    
    // Set up the shader program
    gl.useProgram(mesh.shaderProgram);
    
    if (!mesh.shaderProgram) {
      console.error("Error: Shader program is null.");
      return;
    }
    
    // Set up the model matrix
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, gameObject.position);
    mat4.rotateX(modelMatrix, modelMatrix, gameObject.rotation[0]);
    mat4.rotateY(modelMatrix, modelMatrix, gameObject.rotation[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, gameObject.rotation[2]);
    mat4.scale(modelMatrix, modelMatrix, gameObject.scale);
    
    // Set up the view and projection matrices using the camera
    const viewMatrix = this.camera.getViewMatrix();
    const projectionMatrix = this.camera.getProjectionMatrix();
    
    // Set the model, view, and projection matrix uniforms in the shader program
    const modelUniformLocation = gl.getUniformLocation(mesh.shaderProgram, 'u_model');
    gl.uniformMatrix4fv(modelUniformLocation, false, modelMatrix);
    
    const viewUniformLocation = gl.getUniformLocation(mesh.shaderProgram, 'u_view');
    gl.uniformMatrix4fv(viewUniformLocation, false, viewMatrix);
    
    const projectionUniformLocation = gl.getUniformLocation(mesh.shaderProgram, 'u_projection');
    gl.uniformMatrix4fv(projectionUniformLocation, false, projectionMatrix);
    
    // Set the light uniforms in the shader program
    const lightCountUniformLocation = gl.getUniformLocation(mesh.shaderProgram, 'u_lightCount');
    gl.uniform1i(lightCountUniformLocation, this.lights.length);

    for (let i = 0; i < this.lights.length; i++) {
      const light = this.lights[i];
      const lightColorUniformLocation = gl.getUniformLocation(mesh.shaderProgram, `u_lights[${i}].color`);
      const lightIntensityUniformLocation = gl.getUniformLocation(mesh.shaderProgram, `u_lights[${i}].intensity`);
      const lightDirectionUniformLocation = gl.getUniformLocation(mesh.shaderProgram, `u_lights[${i}].direction`);

      gl.uniform3fv(lightColorUniformLocation, light.color);
      gl.uniform1f(lightIntensityUniformLocation, light.intensity);

      if (light instanceof DirectionalLight) {
        const direction = light.getDirection();
        gl.uniform3fv(lightDirectionUniformLocation, direction);
      } else {
        gl.uniform3fv(lightDirectionUniformLocation, vec3.fromValues(0, 0, 0)); // No direction for area lights
      }
    }


    // Draw the object
    gl.drawArrays(gl.TRIANGLES, 0, mesh.vertices.length / 3);
    
    // Clean up
    gl.disableVertexAttribArray(positionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);  
  }
}
