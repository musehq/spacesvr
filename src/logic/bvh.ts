import { BufferGeometry, Mesh } from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";

/**
 * Gets the number of triangles in a geometry
 */
const getGeometryTriCount = (geometry: BufferGeometry): number => {
  return geometry.index
    ? geometry.index.count / 3
    : geometry.attributes.position.count / 3;
};

/**
 * For a given mesh, set up bvh raycasting for it if it meets the threshold for
 * amount of triangles to use
 *
 * @param mesh
 * @param threshold
 */
export const enableBVHRaycast = (mesh: Mesh, threshold = 0): void => {
  if (!mesh.geometry || !(mesh.geometry as BufferGeometry).isBufferGeometry) {
    return;
  }
  const geometry = mesh.geometry as BufferGeometry;
  const triCount = getGeometryTriCount(geometry);
  if (geometry.boundsTree || triCount < threshold) return;
  mesh.raycast = acceleratedRaycast;
  geometry.computeBoundsTree = computeBoundsTree;
  geometry.disposeBoundsTree = disposeBoundsTree;
  geometry.computeBoundsTree({ verbose: true });
};
