import { mat4, quat, ReadonlyVec3, vec3 } from "gl-matrix";

export abstract class AbstractObject {
  position: vec3;
  rotation: quat;
  scale: vec3;

  constructor() {
    this.position = vec3.create();
    this.rotation = quat.create();
    this.scale = vec3.fromValues(1, 1, 1);
  }

  getModelMatrix(): mat4 {
    const modelMatrix = mat4.create();
    mat4.fromRotationTranslationScale(modelMatrix, this.rotation, this.position, this.scale);
    return modelMatrix;
  }
}
