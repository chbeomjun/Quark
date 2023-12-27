import { useCallback, useEffect, useRef } from 'react';
import { Engine, Camera, Mesh, Light, DirectionalLight, AreaLight, GameObject } from 'grengine';
import { vec2, vec3 } from 'gl-matrix';
import { ModelType } from 'quark/dist/loader/mesh_loader';

const ThreeDScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const use_mouse = useRef(false);

  const camera = new Camera(90, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position[2] = -10;

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const step = 10;
    switch (e.code) {
      case 'ArrowUp':
        camera.position[1] += step;
        break;
      case 'ArrowDown':
        camera.position[1] -= step;
        break;
      case 'ArrowLeft':
        camera.position[0] -= step;
        break;
      case 'ArrowRight':
        camera.position[0] += step;
        break;
      case 'Escape':
        use_mouse.current = !use_mouse.current;
        break;
      default:
        break;
    }
  }, [camera.position, canvasRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const sensitivity = 0.001;
    camera.rotation[0] += e.movementY * sensitivity;
    camera.rotation[1] += e.movementX * sensitivity;
  }, [camera.rotation]);


  const initScene = useCallback(async (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }
    
    const engine = Engine.init(canvas, camera); 

    // Create a light
    const lightColor = vec3.fromValues(1.0, 1.0, 1.0);
    const lightIntensity = 1.0;
    const light = new DirectionalLight(lightColor, lightIntensity);
    light.position[1] = 10;
    light.position[2] = 10;
    light.rotation[0] = Math.PI / 2;    
    engine.createLight(light);

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
      if (use_mouse && canvasRef.current) {
        canvasRef.current.requestPointerLock();
        console.log("locking");
      } else {
        document.exitPointerLock();
        console.log("unlocking");
      }

      // camera.rotation[1] += 0.01;
      engine.update();
      requestAnimationFrame(gameLoop);
      
    };

    gameLoop();
  }, []);
  

  useEffect(() => {
    if (canvasRef.current) {
      initScene(canvasRef.current);

      // Keyboard controls
      window.addEventListener('keydown', handleKeyDown);

      // Mouse controls
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
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