import { Box3, BufferAttribute, BufferGeometry } from "three";
import { MeshBVH } from "three-mesh-bvh";
import { getGeometryTriCount } from "./mesh";

const boundingBox = new Box3();

/**
 * Attempts to generate a bvh and turns into geo while maintaining tri limit
 * @param geometry
 * @param triLimit
 */
export const generateBVHGeo = (
  geometry: BufferGeometry,
  triLimit: number
): BufferGeometry | undefined => {
  let depth = 7;
  let geo: BufferGeometry | undefined = undefined;
  let iteration = 0;
  let triCount = Infinity;
  let oldGeo: BufferGeometry | undefined = undefined;
  let oldTriCount = Infinity;

  do {
    oldTriCount = triCount;
    oldGeo = geo;

    const bvh = new MeshBVH(geometry, { maxDepth: depth, verbose: false });
    geo = bvhToGeo(bvh, depth);
    triCount = getGeometryTriCount(geo);

    if (oldGeo && oldTriCount <= triCount) {
      return oldGeo;
    }

    depth--;
    iteration++;
  } while (triCount > triLimit && iteration < 5);

  return geo;
};

/**
 * Converts a bvh tree to a BufferGeometry
 * Credits go to https://github.com/gkjohnson/three-mesh-bvh/blob/master/src/objects/MeshBVHVisualizer.js
 * @param bvh
 * @param depth
 */
const bvhToGeo = (bvh: MeshBVH, depth: number): BufferGeometry => {
  const geometry = new BufferGeometry();
  const boundsTree = bvh;
  geometry.dispose();

  // count the number of bounds required
  const targetDepth = depth - 1;
  const group = 0;
  const displayParents = false;
  const displayEdges = false;
  let boundsCount = 0;
  boundsTree.traverse((depth, isLeaf) => {
    if (depth === targetDepth || isLeaf) {
      boundsCount++;
      return true;
    } else if (displayParents) {
      boundsCount++;
    }
  }, group);

  // fill in the position buffer with the bounds corners
  let posIndex = 0;
  const positionArray = new Float32Array(8 * 3 * boundsCount);
  boundsTree.traverse((depth, isLeaf, boundingData) => {
    const terminate = depth === targetDepth || isLeaf;
    if (terminate || displayParents) {
      arrayToBox(0, boundingData, boundingBox);
      const { min, max } = boundingBox;
      for (let x = -1; x <= 1; x += 2) {
        const xVal = x < 0 ? min.x : max.x;
        for (let y = -1; y <= 1; y += 2) {
          const yVal = y < 0 ? min.y : max.y;
          for (let z = -1; z <= 1; z += 2) {
            const zVal = z < 0 ? min.z : max.z;
            positionArray[posIndex + 0] = xVal;
            positionArray[posIndex + 1] = yVal;
            positionArray[posIndex + 2] = zVal;

            posIndex += 3;
          }
        }
      }

      return terminate;
    }
  }, group);

  let indexArray;
  let indices;
  if (displayEdges) {
    // fill in the index buffer to point to the corner points
    indices = new Uint8Array([
      // x axis
      0,
      4,
      1,
      5,
      2,
      6,
      3,
      7,

      // y axis
      0,
      2,
      1,
      3,
      4,
      6,
      5,
      7,

      // z axis
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
    ]);
  } else {
    indices = new Uint8Array([
      // X-, X+
      0,
      1,
      2,
      2,
      1,
      3,

      4,
      6,
      5,
      6,
      7,
      5,

      // Y-, Y+
      1,
      4,
      5,
      0,
      4,
      1,

      2,
      3,
      6,
      3,
      7,
      6,

      // Z-, Z+
      0,
      2,
      4,
      2,
      6,
      4,

      1,
      5,
      3,
      3,
      5,
      7,
    ]);
  }

  if (positionArray.length > 65535) {
    indexArray = new Uint32Array(indices.length * boundsCount);
  } else {
    indexArray = new Uint16Array(indices.length * boundsCount);
  }

  const indexLength = indices.length;
  for (let i = 0; i < boundsCount; i++) {
    const posOffset = i * 8;
    const indexOffset = i * indexLength;
    for (let j = 0; j < indexLength; j++) {
      indexArray[indexOffset + j] = posOffset + indices[j];
    }
  }

  // update the geometry
  geometry.setIndex(new BufferAttribute(indexArray, 1, false));
  geometry.setAttribute(
    "position",
    new BufferAttribute(positionArray, 3, false)
  );

  return geometry;
};

function arrayToBox(nodeIndex32: number, array: ArrayBuffer, target: Box3) {
  // @ts-ignore
  target.min.x = array[nodeIndex32];
  // @ts-ignore
  target.min.y = array[nodeIndex32 + 1];
  // @ts-ignore
  target.min.z = array[nodeIndex32 + 2];

  // @ts-ignore
  target.max.x = array[nodeIndex32 + 3];
  // @ts-ignore
  target.max.y = array[nodeIndex32 + 4];
  // @ts-ignore
  target.max.z = array[nodeIndex32 + 5];

  return target;
}
