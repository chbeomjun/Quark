"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFbx = void 0;
const mesh_1 = require("./mesh");
const fbxParser = __importStar(require("fbx-parser"));
function loadFbx(bin) {
    return new Promise(async (resolve, reject) => {
        try {
            let fbxData;
            fbxData = fbxParser.parseBinary(new Uint8Array(bin));
            const vertices = extractVertices(fbxData);
            const normals = extractNormals(fbxData);
            resolve(new mesh_1.Mesh(vertices, normals));
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.loadFbx = loadFbx;
function extractVertices(parsedData) {
    console.log("Loading fbx...");
    if (!parsedData) {
        throw new Error("Invalid FBX data.");
    }
    const objectsNode = parsedData.find((v) => v.name === 'Objects');
    if (!objectsNode) {
        throw new Error("Invalid FBX data: Objects node is missing.");
    }
    const geometries = objectsNode.nodes.filter((v) => v.name === 'Geometry');
    console.log("Objects node:", objectsNode);
    console.log("Geometries:", geometries);
    const vertices = [];
    geometries.forEach((geometry) => {
        const vertexData = geometry.nodes.find((v) => v.name === 'Vertices')?.props;
        if (vertexData) {
            for (let i = 0; i < vertexData.length; i += 3) {
                vertices.push(vertexData[i], vertexData[i + 1], vertexData[i + 2]);
            }
        }
        else {
            console.warn("Geometry without Vertices:", geometry);
        }
    });
    if (vertices.length === 0) {
        throw new Error("Invalid FBX data: Vertices are missing.");
    }
    return vertices;
}
function extractNormals(parsedData) {
    const objectsNode = parsedData.find((v) => v.name === 'Objects');
    const geometries = objectsNode.nodes.filter((v) => v.name === 'Geometry');
    const normals = [];
    geometries.forEach((geometry) => {
        const normalData = geometry.nodes.find((v) => v.name === 'LayerElementNormal')?.nodes.find((v) => v.name === 'Normals')?.props;
        if (normalData) {
            for (let i = 0; i < normalData.length; i += 3) {
                normals.push(normalData[i], normalData[i + 1], normalData[i + 2]);
            }
        }
        else {
            console.warn("Geometry without Normals:", geometry);
        }
    });
    if (normals.length === 0) {
        throw new Error("Invalid FBX data: Normals are missing.");
    }
    return normals;
}
