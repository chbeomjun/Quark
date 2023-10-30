import { useCallback, useEffect, useRef } from 'react';
import { Engine, Camera, Mesh, Light, DirectionalLight, AreaLight, GameObject } from 'grengine';
import { vec2, vec3 } from 'gl-matrix';
import { ModelType } from 'grengine/dist/loader/mesh_loader';

const ThreeDScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initScene = useCallback(async (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }

    const camera = new Camera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position[2] = -10;
    // camera.rotation[0] = Math.PI;
    
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

    const gameObjects: GameObject[] = [];
    
    const gameObject = await engine.createGameObject({
      modelData: { vertices, normals },
      modelType: ModelType.Vertex,
    });

    gameObject.position[2] = 10;

    gameObjects.push(gameObject);

    const gameObject2 = await engine.createGameObject({
      modelData: { vertices, normals },
      modelType: ModelType.Vertex,
    });

    gameObject2.position[2] = -10;
    gameObject2.position[1] = 10;
    gameObject2.position[0] = 10;

    gameObjects.push(gameObject2);

    engine.update();

    window.addEventListener('resize', () => {
      // Update the canvas dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Update viewport
      engine.setViewport(window.innerWidth, window.innerHeight);
      
      // Update the camera's aspect ratio
      // camera.aspect = window.innerWidth / window.innerHeight;
    });

    const gameLoop = () => {
      for (const gameObject of gameObjects) {
          gameObject.rotation[0] += 0.01;
          gameObject.rotation[1] += 0.01;
      }
      camera.rotation[1] += 0.01;
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
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ThreeDScene;