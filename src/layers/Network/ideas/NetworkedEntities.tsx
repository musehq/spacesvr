import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CylinderBufferGeometry,
  InstancedMesh,
  MeshNormalMaterial,
  Object3D,
} from "three";
import { useNetwork } from "../index";
import { useLimitedFrame, useLimiter } from "../../../logic/limiter";

export default function NetworkedEntities() {
  const { connections, connected, useChannel } = useNetwork();

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
  useLimitedFrame(6, () => {
    if (!connected) return;
    const ids = Array.from(connections.keys());
    const sameIds = ids.sort().join(",") === entityIds.sort().join(",");
    if (!sameIds) setEntityIds(ids);
  });

  type Entity = { pos: number[]; rot: number[] };
  const entityChannel = useChannel<Entity, { [key in string]: Entity }>(
    "player",
    "stream",
    (m, s) => {
      if (!m.conn) return;
      s[m.conn.peer] = m.data;
    }
  );

  // send own player data
  useLimitedFrame(15, ({ camera }) => {
    if (!connected) return;
    entityChannel.send({
      pos: camera.position.toArray().map((p) => parseFloat(p.toPrecision(3))),
      rot: camera.rotation
        .toArray()
        .slice(0, 3)
        .map((r) => parseFloat(r.toPrecision(3))),
    });
  });

  // receive player data
  useLimitedFrame(50, () => {
    if (!mesh.current) return;
    for (const id of Object.keys(entityChannel.state)) {
      const index = entityIds.indexOf(id);
      if (index < 0) return;
      const { pos, rot } = entityChannel.state[id];
      obj.position.fromArray(pos);
      obj.rotation.fromArray(rot);
      obj.updateMatrix();
      mesh.current?.setMatrixAt(index, obj.matrix);
    }
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
