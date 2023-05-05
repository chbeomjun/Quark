import { quat, vec2, vec3, vec4 } from 'gl-matrix';
import { GameObject } from './game_object';
import { AbstractObject } from "./abstract_object";

export abstract class Light extends AbstractObject {
  color: vec3;
  intensity: number;

  constructor(color: vec3, intensity: number) {
    super();
    this.intensity = intensity
    this.color = color;
  }
}

export class DirectionalLight extends Light {
  constructor(color: vec3, intensity: number) {
    super(color, intensity);
  }

  public getDirection(): vec3 {
    const direction = vec3.create();
    const rotationQuat = quat.normalize(quat.create(), this.rotation);
    const directionVec4 = vec4.fromValues(0, 0, -1, 1);
    vec3.transformQuat(direction, directionVec4.slice(0, 3) as vec3, rotationQuat);

    return direction;
  }
}

export class AreaLight extends Light {
  public position: vec3;
  public size: vec2;

  constructor(color: vec3, intensity: number, position: vec3, size: vec2) {
    super(color, intensity);
    this.position = position;
    this.size = size;
  }

  // You can add other methods specific to AreaLight here
}
