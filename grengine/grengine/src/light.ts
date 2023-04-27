import { vec3 } from 'gl-matrix';
import { GameObject } from './game_object';

export abstract class Light extends GameObject {
  public color: vec3;
  public intensity: number;

  constructor(color: vec3, intensity: number) {
    super();
    this.color = color;
    this.intensity = intensity;
  }
}

export class DirectionalLight extends Light {
  constructor(color: vec3, intensity: number) {
    super(color, intensity);
  }

  public getDirection(): vec3 {
    const direction = vec3.create();
    vec3.transformQuat(direction, vec3.fromValues(0, 0, -1), this.rotation);
    return direction;
  }
}

export class AreaLight extends Light {
  constructor(color: vec3, intensity: number) {
    super(color, intensity);
  }
}
