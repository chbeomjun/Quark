import { useCallback, useEffect, useRef } from 'react';
import { Engine, Camera, Mesh, Light, DirectionalLight, AreaLight } from 'grengine';
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

    const objURL = 'capybara.obj';
    const response = await fetch(objURL);
    const objData = await response.text();

    console.log(objData);
    console.log(response)
    console.log("====================================")
    
    const gameObject = await engine.createGameObject({
      modelData: objData,
      modelType: ModelType.OBJ,
      shaderProgram: engine.defaultShaderProgram
    });

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