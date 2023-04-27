import { Mesh } from './mesh';
import * as fbxParser from 'fbx-parser';

export function loadFbx(bin: ArrayBuffer): Promise<Mesh> {
  return new Promise(async (resolve, reject) => {
    try {
      let fbxData: fbxParser.FBXData
      fbxData = fbxParser.parseBinary(new Uint8Array(bin));

      const vertices = extractVertices(fbxData);

      const normals = extractNormals(fbxData);

      resolve(new Mesh(vertices, normals));
    } catch (error) {
      reject(error);
    }
  });
}

function extractVertices(parsedData: any): number[] {

  console.log("Loading fbx...")

  if (!parsedData) {
    throw new Error("Invalid FBX data.");
  }

  const objectsNode = parsedData.find((v: any) => v.name === 'Objects');
  if (!objectsNode) {
    throw new Error("Invalid FBX data: Objects node is missing.");
  }

  const geometries = objectsNode.nodes.filter((v: any) => v.name === 'Geometry');

  console.log("Objects node:", objectsNode);
  console.log("Geometries:", geometries);

  const vertices: number[] = [];

  geometries.forEach((geometry: any) => {
    const vertexData = geometry.nodes.find((v: any) => v.name === 'Vertices')?.props;
    if (vertexData) {
      for (let i = 0; i < vertexData.length; i += 3) {
        vertices.push(vertexData[i], vertexData[i + 1], vertexData[i + 2]);
      }
    } else {
      console.warn("Geometry without Vertices:", geometry);
    }
  });

  if (vertices.length === 0) {
    throw new Error("Invalid FBX data: Vertices are missing.");
  }

  return vertices;
}


function extractNormals(parsedData: any): number[] {
  const objectsNode = parsedData.find((v: any) => v.name === 'Objects');
  const geometries = objectsNode.nodes.filter((v: any) => v.name === 'Geometry');
  const normals: number[] = [];

  geometries.forEach((geometry: any) => {
    const normalData = geometry.nodes.find((v: any) => v.name === 'LayerElementNormal')?.nodes.find((v: any) => v.name === 'Normals')?.props;
    if (normalData) {
      for (let i = 0; i < normalData.length; i += 3) {
        normals.push(normalData[i], normalData[i + 1], normalData[i + 2]);
      }
    } else {
      console.warn("Geometry without Normals:", geometry);
    }
  });

  if (normals.length === 0) {
    throw new Error("Invalid FBX data: Normals are missing.");
  }
  
  return normals;
  }


