import { useCallback, useEffect, useRef } from 'react';
import { Engine, Camera, Mesh, Light, DirectionalLight, AreaLight } from 'grengine';
import { vec2, vec3 } from 'gl-matrix';

const ThreeDScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initScene = useCallback(async (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }

    const camera = new Camera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position[2] = -10;
    camera.rotation[0] = Math.PI;
    
    const engine = Engine.init(canvas, camera);

    // Create a light
    const lightColor = vec3.fromValues(1.0, 1.0, 1.0);
    const lightIntensity = 1.0;
    const light = new DirectionalLight(lightColor, lightIntensity);
    light.position[1] = 10;
    light.position[2] = 10;
    light.rotation[0] = Math.PI / 2;    
    engine.createLight(light);

    // const areaLight = new AreaLight(
    //   vec3.fromValues(1, 1, 1), // color
    //   1.0, // intensity
    //   vec3.fromValues(0, 5, 0), // position
    //   vec2.fromValues(10, 10) // size
    // );
    // engine.createLight(areaLight);  
    

    window.addEventListener('resize', () => {
      engine.setViewport(window.innerWidth, window.innerHeight);
    });

    const fbxResponse = await fetch('dino.fbx'); // Adjust the path to your FBX file

    console.log(fbxResponse);

    const fbxData = await fbxResponse.arrayBuffer();

    console.log(fbxData);

    // const gameObject = await engine.createGameObject({ fbx: fbxData });
    // gameObject.setUniformScale(1);
    // gameObject.position[2] = 10;
    // gameObject.rotation[0] = 90;

    const vertices = [
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
    
    

    const normals = [
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
    
    
    const gameObject = await engine.createGameObject({ vertices: vertices, normals: normals })
    

    engine.update();

    const gameLoop = () => {
      gameObject.rotation[0] += 0.01;
      gameObject.rotation[1] += 0.01;

      engine.update();
      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      initScene(canvasRef.current);
    }
  }, [canvasRef, initScene]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ThreeDScene;
