import { ReactNode, useEffect, useRef, useState } from "react";
import { BufferGeometry, Group, Mesh } from "three";
import {
  findColliderMeshes,
  getGeometryTriCount,
  getMeshes,
  getMeshesUUID,
  getTransformedMeshGeo,
} from "./utils/mesh";
import { generateBVHGeo } from "./utils/bvh";
import TrimeshCollider from "./components/TrimeshCollider";

type CollidableProps = {
  children: ReactNode | ReactNode[];
  triLimit?: number;
  enabled?: boolean;
  hideCollisionMeshes?: boolean;
};

export default function Collidable(props: CollidableProps) {
  const {
    children,
    triLimit = 1000,
    enabled = true,
    hideCollisionMeshes = false,
  } = props;

  const group = useRef<Group>(null);
  const geoUUID = useRef<string>();
  const [collisionMeshes, setCollisionMeshes] = useState<Mesh[]>();
  const [collisionGeos, setCollisionGeos] = useState<BufferGeometry[]>();

  // func to create uuid to know when to regenerate
  const createUUID = (meshes: Mesh[]) => triLimit + "-" + getMeshesUUID(meshes);

  // register collision meshes and collision geos
  useEffect(() => {
    if (!group.current || !enabled) {
      setCollisionGeos(undefined);
      setCollisionMeshes(undefined);
      geoUUID.current = undefined;
      return;
    }

    // if the user names the meshes themselves, give them full control
    const colliderMeshes = findColliderMeshes(group.current);
    if (colliderMeshes) {
      if (createUUID(colliderMeshes) === geoUUID.current) return;
      setCollisionMeshes(colliderMeshes);
      const geos = colliderMeshes.map((m) =>
        getTransformedMeshGeo(m, group.current as Group)
      );
      setCollisionGeos(geos);
      geoUUID.current = createUUID(colliderMeshes);
      return;
    }

    // otherwise, use all the meshes in the model
    const meshes = getMeshes(group.current);
    if (createUUID(meshes) === geoUUID.current) return;
    setCollisionMeshes(meshes);
    geoUUID.current = createUUID(meshes);

    // aggregate geos in the model
    const geos = meshes.map((m) =>
      getTransformedMeshGeo(m, group.current as Group)
    );

    // either use geo directly or bvh version, depending on tri count
    const triCount = geos.reduce((c, g) => c + getGeometryTriCount(g), 0);
    if (triCount < triLimit) {
      setCollisionGeos(geos);
    } else {
      const perc = triLimit / triCount;
      const bvhGeos = geos
        .map((g) => generateBVHGeo(g, getGeometryTriCount(g) * perc))
        .filter((g) => g) as BufferGeometry[];
      setCollisionGeos(bvhGeos);
    }
  }, [children, triLimit, enabled]);

  // hide or show collision meshes
  useEffect(() => {
    if (!collisionMeshes) return;
    collisionMeshes.map(
      (collider) => (collider.visible = !hideCollisionMeshes)
    );
    return () => {
      collisionMeshes.map((collider) => (collider.visible = true));
    };
  }, [collisionMeshes, hideCollisionMeshes]);

  return (
    <group name="collidable" ref={group}>
      {children}
      {enabled &&
        collisionGeos &&
        collisionGeos.map((geo, i) => (
          <TrimeshCollider key={geo.uuid} geo={geo} />
        ))}
    </group>
  );
}
