"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMesh = exports.ModelType = void 0;
// mesh_loader.ts
const mesh_1 = require("../mesh");
const obj_loader_1 = require("./obj_loader"); // Import loadObj from fbx_loader.ts, which contains loadObj function
var ModelType;
(function (ModelType) {
    ModelType[ModelType["OBJ"] = 0] = "OBJ";
    ModelType[ModelType["FBX"] = 1] = "FBX";
    ModelType[ModelType["Vertex"] = 2] = "Vertex";
})(ModelType = exports.ModelType || (exports.ModelType = {}));
async function loadMesh(modelData, modelType, shaderProgram) {
    let mesh;
    switch (modelType) {
        case ModelType.OBJ:
            if (typeof modelData === 'string') {
                mesh = await (0, obj_loader_1.loadObj)(modelData);
            }
            else {
                throw new Error('Invalid data type for OBJ model. Expected a string.');
            }
            break;
        // case ModelType.FBX:
        //   if (modelData instanceof ArrayBuffer) {
        //     mesh = await loadFbx(modelData);
        //   } else {
        //     throw new Error('Invalid data type for FBX model. Expected an ArrayBuffer.');
        //   }
        //   break;
        case ModelType.Vertex:
            if (typeof modelData === 'object' && 'vertices' in modelData && 'normals' in modelData) {
                mesh = mesh = new mesh_1.Mesh(modelData.vertices, modelData.normals, [], shaderProgram);
            }
            else {
                throw new Error('Invalid data type for Vertex model. Expected an object with vertices and normals.');
            }
            break;
        default:
            throw new Error('Invalid model type.');
    }
    console.log(mesh);
    return mesh;
}
exports.loadMesh = loadMesh;
