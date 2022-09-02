import { useMemo, useRef } from "react";
import {
  CylinderBufferGeometry,
  InstancedMesh,
  MeshNormalMaterial,
  PositionalAudio,
} from "three";
import { useNetwork } from "../../logic/network";
import { useLimitedFrame } from "../../../../logic/limiter";
import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import {
  Snapshot,
  Entity as EntityState,
  Quat,
} from "@geckos.io/snapshot-interpolation/lib/types";
import { useObj } from "./logic/resources";
import { useEntities } from "./logic/entity";

export default function NetworkedEntities() {
  const { connected, useChannel } = useNetwork();

  const mesh = useRef<InstancedMesh>(null);
  const geo = useMemo(() => new CylinderBufferGeometry(0.3, 0.3, 1, 32), []);
  const mat = useMemo(() => new MeshNormalMaterial(), []);
  const obj = useObj();

  const posAudios = useMemo<PositionalAudio[]>(() => [], []);
  const entities = useEntities();

  // set up channel to send/receive data
  const NETWORK_FPS = 12;
  type EntityTransform = { pos: number[]; rot: number[] };
  const SI = useMemo(() => new SnapshotInterpolation(NETWORK_FPS), []);
  const entityChannel = useChannel<
    EntityTransform,
    { [id: string]: EntityTransform }
  >("player", "stream", (m, s) => {
    if (!m.conn) return;
    s[m.conn.peer] = m.data;

    const state: EntityState[] = Object.keys(s).map((key) => ({
      id: key,
      x: s[key].pos[0],
      y: s[key].pos[1],
      z: s[key].pos[2],
      q: {
        x: s[key].rot[0],
        y: s[key].rot[1],
        z: s[key].rot[2],
        w: s[key].rot[3],
      },
    }));

    const snapshot: Snapshot = {
      id: Math.random().toString(),
      time: new Date().getTime(),
      state,
    };

    SI.vault.add(snapshot);
  });

  // send own player data
  useLimitedFrame(NETWORK_FPS, ({ camera }) => {
    if (!connected) return;
    entityChannel.send({
      pos: camera.position.toArray(),
      rot: camera.quaternion.toArray(),
    });
  });

  // receive player data
  useLimitedFrame(55, () => {
    if (!mesh.current) return;

    const snapshot = SI.calcInterpolation("x y z q(quat)");
    if (!snapshot) return;

    let i = 0;
    for (const entityState of snapshot.state) {
      const { x, y, z, q } = entityState;
      obj.position.x = x as number;
      obj.position.y = y as number;
      obj.position.z = z as number;
      obj.position.y -= 0.2; // they were floating before, idk where the constant comes from really
      const quat = q as Quat;
      obj.quaternion.x = quat.x;
      obj.quaternion.y = quat.y;
      obj.quaternion.z = quat.z;
      obj.quaternion.w = quat.w;
      obj.updateMatrix();
      mesh.current.setMatrixAt(i, obj.matrix);

      const audio = posAudios[i];
      if (audio) {
        obj.matrix.decompose(audio.position, audio.quaternion, audio.scale);
      }
      i++;
    }

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (!connected) {
    return null;
  }

  return (
    <group>
      {entities.map(
        (entity) =>
          entity.posAudio && (
            <primitive
              key={entity.posAudio.userData.peerId}
              object={entity.posAudio}
            />
          )
      )}
      <instancedMesh
        ref={mesh}
        args={[geo, mat, entities.length]}
        matrixAutoUpdate={false}
      />
    </group>
  );
}
