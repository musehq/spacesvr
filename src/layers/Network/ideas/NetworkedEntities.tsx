import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CylinderBufferGeometry,
  InstancedMesh,
  MeshNormalMaterial,
  Object3D,
} from "three";
import { useNetwork } from "../index";
import { useLimiter } from "../../../logic/limiter";

export default function NetworkedEntities() {
  const { connections, connected, useStream } = useNetwork();

  const mesh = useRef<InstancedMesh>();
  const geo = useMemo(() => new CylinderBufferGeometry(0.3, 0.3, 1, 30), []);
  const mat = useMemo(() => new MeshNormalMaterial(), []);
  const obj = useMemo(() => {
    const o = new Object3D();
    o.matrixAutoUpdate = false;
    return o;
  }, []);

  // check for a change in player list, re-render if there is a change
  const [entityIds, setEntityIds] = useState<string[]>([]);
  const limiter = useLimiter(30);
  useFrame(({ clock }) => {
    if (!connected || !limiter.isReady(clock)) return;
    const ids = Array.from(connections.keys());
    const sameIds = ids.sort().join(",") === entityIds.sort().join(",");
    if (!sameIds) setEntityIds(ids);
  });

  useStream<{ pos: number[]; rot: number[] }>("player", ({ conn, data }) => {
    if (!mesh.current) return;
    const index = entityIds.indexOf(conn.peer);
    if (index < 0) return;
    const { pos, rot } = data;
    obj.position.fromArray(pos);
    obj.rotation.fromArray(rot);
    obj.updateMatrix();
    mesh.current?.setMatrixAt(index, obj.matrix);
  });

  const renderLimiter = useLimiter(40);
  useFrame(({ clock }) => {
    if (!mesh.current || !renderLimiter.isReady(clock)) return;
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (!connected) {
    return null;
  }

  return (
    <group>
      <instancedMesh
        ref={mesh}
        args={[geo, mat, entityIds.length]}
        matrixAutoUpdate={false}
      />
    </group>
  );
}
