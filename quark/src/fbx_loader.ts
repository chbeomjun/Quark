import { Mesh } from './mesh';

export function loadObj(objText: string): Promise<Mesh> {
  return new Promise((resolve, reject) => {
    try {
      const vertices = extractVertices(objText);
      const normals = extractNormals(objText);
      resolve(new Mesh(vertices, normals, []));
    } catch (error) {
      reject(error);
    }
  });
}

function extractVertices(objText: string): number[] {
  const lines = objText.split('\n');
  const vertices: number[] = [];

  lines.forEach((line) => {
    if (line.startsWith('v ')) {
      const parts = line.split(' ').map((part) => parseFloat(part));
      vertices.push(parts[1], parts[2], parts[3]);
    }
  });

  if (vertices.length === 0) {
    throw new Error("Invalid OBJ data: Vertices are missing.");
  }

  return vertices;
}

function extractNormals(objText: string): number[] {
  const lines = objText.split('\n');
  const normals: number[] = [];

  lines.forEach((line) => {
    if (line.startsWith('vn ')) {
      const parts = line.split(' ').map((part) => parseFloat(part));
      normals.push(parts[1], parts[2], parts[3]);
    }
  });

  if (normals.length === 0) {
    throw new Error("Invalid OBJ data: Normals are missing.");
  }

  return normals;
}

function extractColors(objText: string): number[] {
  const lines = objText.split('\n');
  const colors: number[] = [];

  lines.forEach((line) => {
    if (line.startsWith('vc ')) { // Assuming 'vc' is the prefix for vertex colors
      const parts = line.split(' ').map((part) => parseFloat(part));
      colors.push(parts[1], parts[2], parts[3]); // RGB values
    }
  });

  if (colors.length === 0) {
    throw new Error("Invalid OBJ data: Vertex colors are missing.");
  }

  return colors;
}
