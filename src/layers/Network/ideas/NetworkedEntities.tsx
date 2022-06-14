import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CylinderBufferGeometry,
  InstancedMesh,
  MeshNormalMaterial,
  Object3D,
} from "three";
import { useNetwork } from "../logic/network";
import { useLimitedFrame, useLimiter } from "../../../logic/limiter";
import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import {
  Snapshot,
  Entity as EntityState,
} from "@geckos.io/snapshot-interpolation/lib/types";

export default function NetworkedEntities() {
  const { connections, connected, useChannel } = useNetwork();

  const mesh = useRef<InstancedMesh>(null);
  const geo = useMemo(() => new CylinderBufferGeometry(0.3, 0.3, 1, 32), []);
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

  const NETWORK_FPS = 10;
  type Entity = { pos: number[]; rot: number[] };
  const SI = useMemo(() => new SnapshotInterpolation(NETWORK_FPS), []);
  const entityChannel = useChannel<Entity, { [key in string]: Entity }>(
    "player",
    "stream",
    (m, s) => {
      if (!m.conn) return;
      s[m.conn.peer] = m.data;

      const state: EntityState[] = Object.keys(s).map((key) => ({
        id: key,
        x: s[key].pos[0],
        y: s[key].pos[1],
        z: s[key].pos[2],
        rx: s[key].rot[0],
        ry: s[key].rot[1],
        rz: s[key].rot[2],
      }));

      const snapshot: Snapshot = {
        id: Math.random().toString(),
        time: new Date().getTime(),
        state,
      };

      SI.vault.add(snapshot);
    }
  );

  // send own player data
  useLimitedFrame(NETWORK_FPS, ({ camera }) => {
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
  useLimitedFrame(55, () => {
    if (!mesh.current) return;

    const snapshot = SI.calcInterpolation("x y z rx ry rz");
    if (!snapshot) return;

    let i = 0;
    for (const entityState of snapshot.state) {
      const { x, y, z, rx, ry, rz } = entityState;
      obj.position.x = x as number;
      obj.position.y = y as number;
      obj.position.z = z as number;
      obj.position.y -= 0.2; // they were floating before, idk where the constant comes from really
      obj.rotation.x = rx as number;
      obj.rotation.y = ry as number;
      obj.rotation.z = rz as number;
      obj.updateMatrix();
      mesh.current.setMatrixAt(i, obj.matrix);
      i++;
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
