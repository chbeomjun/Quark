"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const game_object_1 = require("./game_object");
const gl_matrix_1 = require("gl-matrix");
const light_1 = require("./light");
class Engine {
    static instance;
    cameras = [];
    gameObjects = [];
    MAX_LIGHTS = 100;
    lights = [];
    createLight(light) {
        this.lights.push(light);
        return light;
    }
    removeLight(light) {
        const index = this.lights.indexOf(light);
        if (index !== -1) {
            this.lights.splice(index, 1);
        }
    }
    constructor() {
    }
    static init() {
        if (!Engine.instance) {
            Engine.instance = new Engine();
        }
        return Engine.instance;
    }
    addCamera(camera) {
        this.cameras.push(camera);
    }
    removeCamera(camera) {
        const index = this.cameras.indexOf(camera);
        if (index !== -1) {
            this.cameras.splice(index, 1);
        }
    }
    startGameLoop() {
        const loop = () => {
            this.update();
            requestAnimationFrame(loop);
        };
        loop();
    }
    createWebGLContext(canvas) {
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
    async createGameObject(options) {
        const gameObject = await game_object_1.GameObject.create(options);
        this.gameObjects.push(gameObject);
        return gameObject;
    }
    destroy(gameObject) {
        const index = this.gameObjects.indexOf(gameObject);
        if (index !== -1) {
            this.gameObjects.splice(index, 1);
        }
    }
    update() {
        for (const camera of this.cameras) {
            camera.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            camera.gl.clear(camera.gl.COLOR_BUFFER_BIT | camera.gl.DEPTH_BUFFER_BIT);
        }
        for (const gameObject of this.gameObjects) {
            gameObject.update();
            for (const camera of this.cameras) {
                this.render(gameObject, camera);
            }
        }
    }
    render(gameObject, camera) {
        const mesh = gameObject.mesh;
        const gl = camera.gl;
        // Set up the shader program
        const shaderProgram = mesh.shaderProgram || camera.defaultShaderProgram;
        if (!shaderProgram) {
            console.error("Error: No shader program available for rendering.");
            return;
        }
        // Create and bind the vertex buffer
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
        // Create and bind the normal buffer
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.colors), gl.STATIC_DRAW);
        const colorAttribute = gl.getAttribLocation(shaderProgram, 'a_color');
        gl.enableVertexAttribArray(colorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(colorAttribute, 4, gl.FLOAT, false, 0, 0);
        gl.useProgram(shaderProgram);
        // Set up the position attribute
        const positionAttribute = gl.getAttribLocation(shaderProgram, 'a_position');
        gl.enableVertexAttribArray(positionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
        // Set up the normal attribute
        const normalAttribute = gl.getAttribLocation(shaderProgram, 'a_normal');
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
        const modelMatrix = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.translate(modelMatrix, modelMatrix, gameObject.position);
        gl_matrix_1.mat4.rotateX(modelMatrix, modelMatrix, gameObject.rotation[0]);
        gl_matrix_1.mat4.rotateY(modelMatrix, modelMatrix, gameObject.rotation[1]);
        gl_matrix_1.mat4.rotateZ(modelMatrix, modelMatrix, gameObject.rotation[2]);
        gl_matrix_1.mat4.scale(modelMatrix, modelMatrix, gameObject.scale);
        // Set up the view and projection matrices using the camera
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
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
            if (light instanceof light_1.DirectionalLight) {
                const direction = light.getDirection();
                gl.uniform3fv(lightDirectionUniformLocation, direction);
            }
            else {
                gl.uniform3fv(lightDirectionUniformLocation, gl_matrix_1.vec3.fromValues(0, 0, 0)); // No direction for area lights
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
exports.Engine = Engine;
