import { useCallback, useEffect, useRef } from 'react';
import { Engine, Camera } from 'grengine';

const ThreeDScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initScene = useCallback(async (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }

    const camera = new Camera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position[2] = -10;
    const engine = Engine.init(canvas, camera);

    window.addEventListener('resize', () => {
      engine.setViewport(window.innerWidth, window.innerHeight);
    });

    const fbxResponse = await fetch('dino.fbx'); // Adjust the path to your FBX file

    console.log(fbxResponse);

    const fbxData = await fbxResponse.arrayBuffer();

    console.log(fbxData);

    const gameObject = await engine.createGameObject({ fbx: fbxData });
    gameObject.setUniformScale(1);
    gameObject.position[2] = 10;
    gameObject.rotation[0] = 90;

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
