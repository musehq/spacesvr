import { ReactNode, useMemo, useRef } from "react";
import {
  CylinderBufferGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshNormalMaterial,
} from "three";
import { useNetwork } from "../../logic/network";
import { useLimitedFrame } from "../../../../logic/limiter";
import { SnapshotInterpolation } from "@geckos.io/snapshot-interpolation";
import {
  Entity as EntityState,
  Quat,
} from "@geckos.io/snapshot-interpolation/lib/types";
import { useObj } from "./logic/resources";
import { useEntities } from "./logic/entity";
import { useModel, useRerender } from "../../../../logic";

const ZIPPA_MODEL =
  "https://d1htv66kutdwsl.cloudfront.net/238a7ef1-c47a-4630-adf1-4e763c8a41d5/79decc4d-4521-44ad-9272-d3627bef738f.glb";

type NetworkedEntitiesProps = {
  children?: ReactNode | ReactNode[];
};

export default function NetworkedEntities(props: NetworkedEntitiesProps) {
  const { children } = props;

  const { connected, useChannel } = useNetwork();

  const group = useRef<Group>(null);
  const meshes = useRef<InstancedMesh[]>([]);
  const obj = useObj();
  const rerender = useRerender();

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

    SI.vault.add({
      id: Math.random().toString(),
      time: new Date().getTime(),
      state,
    });
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
    if (!group.current) return;

    const snapshot = SI.calcInterpolation("x y z q(quat)");
    if (!snapshot) return;

    let changed = false;
    // 1. find any meshes that haven't already been converted to instanced meshes in the local array
    group.current.traverse((child) => {
      if (child instanceof Mesh) {
        const index = meshes.current.findIndex(
          (m) => m.userData.meshId === child.id
        );
        if (index === -1) {
          changed = true;
          const geometry = child.geometry;
          const material = child.material;
          const mesh = new InstancedMesh(geometry, material, entities.length);
          mesh.userData.meshId = child.id;
          meshes.current.push(mesh);
        }
      }
    });

    // 2. remove any meshes that have been removed from the scene
    meshes.current.forEach((mesh, index) => {
      if (!group.current?.getObjectById(mesh.id)) {
        const removed = meshes.current.splice(index, 1);
        for (mesh of removed) {
          changed = true;
          mesh.dispose();
        }
      }
    });

    // 3. update the instanced meshes
    meshes.current.forEach((mesh) => {
      if (mesh.count != entities.length) {
        mesh.count = entities.length;
        changed = true;
      }
    });

    if (changed) {
      console.log("changed!");
      rerender();
    }

    let i = 0;
    for (const entityState of snapshot.state) {
      const { x, y, z, q } = entityState;
      obj.position.set(x as number, y as number, z as number);
      obj.position.y -= 0.2; // they were floating before, idk where the constant comes from really
      const quat = q as Quat;
      obj.quaternion.set(
        quat.x as number,
        quat.y as number,
        quat.z as number,
        quat.w as number
      );
      obj.updateMatrix();

      for (const mesh of meshes.current) {
        mesh.setMatrixAt(i, obj.matrix);
      }

      const posAudio = entities[i]?.posAudio;
      if (posAudio) {
        obj.matrix.decompose(
          posAudio.position,
          posAudio.quaternion,
          posAudio.scale
        );
        posAudio.rotation.y += Math.PI; // for some reason it's flipped
        posAudio.updateMatrix();
      }

      i++;
    }

    for (const mesh of meshes.current) {
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  // const model = useModel(ZIPPA_MODEL);

  /**
   *
   *         <instancedMesh
   *           args={[
   *             model.nodes.Zip_Head001_Mesh001.geometry,
   *             mat,
   *             entities.length,
   *           ]}
   *           matrixAutoUpdate={false}
   *         />
   */

  if (!connected) {
    return null;
  }

  return (
    <group name="spacesvr-entities">
      {entities.map(
        (entity) =>
          entity.posAudio && (
            <primitive
              key={entity.posAudio.uuid}
              object={entity.posAudio}
              matrixAutoUpdate={false}
            />
          )
      )}
      {meshes.current.map((mesh) =>
        mesh ? <primitive key={mesh.id} object={mesh} /> : null
      )}
      <group name="spacesvr-entities-meshes" ref={group} visible={false}>
        {children}
        {!children && (
          <mesh>
            <cylinderBufferGeometry args={[0.1, 0.1, 0.2, 8]} />
            <meshNormalMaterial />
          </mesh>
        )}
      </group>
    </group>
  );
}
