import {
  Box3,
  BufferGeometry,
  Euler,
  Mesh,
  Object3D,
  Quaternion,
  Vector3,
} from "three";

/**
 * Traverses an object 3d to find any meshes marked collidable by their name
 */
const KEYWORDS = ["collider", "collision"];
export const findColliderMeshes = (obj: Object3D): Mesh[] | undefined => {
  const result: Mesh[] = [];

  obj.traverse((node) => {
    if ((node as Mesh).isMesh) {
      for (const keyword of KEYWORDS) {
        if (node.name.toLowerCase().includes(keyword)) {
          result.push(node as Mesh);
        }
      }
    }
  });

  if (result.length > 0) {
    return result;
  }

  return undefined;
};

/**
 * Traverses an object 3d to count all of its meshes' triangles
 */
export const getTriangleCount = (obj: Object3D): number => {
  let count = 0;

  obj.traverse((node) => {
    if ((node as Mesh).isMesh) {
      count += getGeometryTriCount((node as Mesh).geometry);
    }
  });

  return count;
};

/**
 * Gets the number of triangles in a geometry
 */
export const getGeometryTriCount = (geometry: BufferGeometry): number => {
  return geometry.index
    ? geometry.index.count / 3
    : geometry.attributes.position.count / 3;
};

/**
 * Traverses an object 3d to find and return all meshes
 */
export const getMeshes = (obj: Object3D): Mesh[] => {
  const result: Mesh[] = [];

  obj.traverse((node) => {
    if ((node as Mesh).isMesh) {
      result.push(node as Mesh);
    }
  });

  return result;
};

/**
 * Get the scale for a group to normalize it to 1m
 */
export const getNormScale = (obj: Object3D) => {
  const bbox = new Box3().setFromObject(obj);

  let max = -Infinity;
  if (bbox.max.x > max) max = bbox.max.x;
  if (bbox.max.y > max) max = bbox.max.y;
  if (bbox.max.z > max) max = bbox.max.z;
  if (Math.abs(bbox.min.x) > max) max = Math.abs(bbox.min.x);
  if (Math.abs(bbox.min.y) > max) max = Math.abs(bbox.min.y);
  if (Math.abs(bbox.min.z) > max) max = Math.abs(bbox.min.z);

  return 1 / max;
};

/**
 * Given a mesh, clone the geo and apply the transformations. pass a parent to cap off transforms
 */
export const getTransformedMeshGeo = (
  mesh: Mesh,
  parent: Object3D
): BufferGeometry => {
  const geo = mesh.geometry.clone();
  mesh.updateWorldMatrix(true, false);

  const pos = new Vector3();
  const quat = new Quaternion();
  const euler = new Euler();
  const scale = new Vector3();

  let obj: Object3D | null = mesh;
  do {
    obj.matrix.decompose(pos, quat, scale);
    euler.setFromQuaternion(quat);

    geo.scale(scale.x, scale.y, scale.z);
    geo.rotateX(euler.x);
    geo.rotateY(euler.y);
    geo.rotateZ(euler.z);
    geo.translate(pos.x, pos.y, pos.z);

    obj = obj.parent;
  } while (obj && obj !== parent);

  return geo;
};

/**
 * Gets a uuid for an arr of meshes
 */
export const getMeshesUUID = (meshes: Mesh[]): string => {
  const uuids = meshes.map((mesh) => mesh.uuid);
  uuids.sort();
  return uuids.join("-");
};
