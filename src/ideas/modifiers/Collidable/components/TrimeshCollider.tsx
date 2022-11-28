import {
  BufferGeometry,
  Euler,
  Group,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import { useMemo, useRef, useState } from "react";
import { useLimitedFrame } from "../../../../logic/limiter";
import { useTrimeshCollision } from "../utils/trimesh";

type TrimeshColliderProps = {
  geo: BufferGeometry;
};

export default function TrimeshCollider(props: TrimeshColliderProps) {
  const { geo } = props;

  const group = useRef<Group>(null);

  const [pos] = useState(() => new Vector3());
  const [quat] = useState(() => new Quaternion());
  const [scale] = useState(() => new Vector3());
  const [euler] = useState(() => new Euler());
  const [curScale, setCurScale] = useState(new Vector3(1, 1, 1));

  const geometry = useMemo(() => {
    const g = geo.clone().scale(curScale.x, curScale.y, curScale.z);
    g.computeVertexNormals();
    return g;
  }, [geo, curScale]);

  const [, api] = useTrimeshCollision(geometry, {
    pos: pos.toArray(),
    rot: [euler.x, euler.y, euler.z],
  });

  const lastUpdatedMatrix = useRef<Matrix4>(new Matrix4());
  useLimitedFrame(8, () => {
    if (!group.current) return;

    // get global position, rotation, scale
    group.current.updateWorldMatrix(true, false);
    group.current.matrixWorld.decompose(pos, quat, scale);

    // no need to update if nothing changed
    if (lastUpdatedMatrix.current.equals(group.current.matrixWorld)) {
      return;
    }

    // update last values
    lastUpdatedMatrix.current.copy(group.current.matrixWorld);

    // if a change was found, update collider
    api.position.copy(pos);
    api.rotation.copy(euler.setFromQuaternion(quat));
    if (!scale.equals(curScale)) setCurScale(scale.clone());
  });

  return <group ref={group} />;
}
