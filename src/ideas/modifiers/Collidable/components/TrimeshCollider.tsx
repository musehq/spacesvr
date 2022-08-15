import { BufferGeometry, Euler, Group, Quaternion, Vector3 } from "three";
import { useMemo, useRef, useState } from "react";
import { useLimiter } from "../../../../logic/limiter";
import { useFrame } from "@react-three/fiber";
import { useTrimeshCollision } from "../utils/trimesh";

type TrimeshColliderProps = {
  geo: BufferGeometry;
};

export default function TrimeshCollider(props: TrimeshColliderProps) {
  const { geo } = props;

  const group = useRef<Group>(null);

  const dummyPos = useMemo(() => new Vector3(), []);
  const dummyQuat = useMemo(() => new Quaternion(), []);
  const dummyEuler = useMemo(() => new Euler(), []);
  const dummyScale = useMemo(() => new Vector3(1, 1, 1), []);
  const [scale, setScale] = useState(new Vector3(1, 1, 1));

  const geometry = useMemo(() => {
    const g = geo.clone().scale(scale.x, scale.y, scale.z);
    g.computeVertexNormals();
    return g;
  }, [geo, scale]);

  const [, api] = useTrimeshCollision(geometry);

  const limiter = useLimiter(5);
  useFrame(({ clock }) => {
    if (!limiter.isReady(clock) || !group.current) return;

    group.current.getWorldPosition(dummyPos);
    group.current.getWorldQuaternion(dummyQuat);
    group.current.getWorldScale(dummyScale);

    api.position.copy(dummyPos);
    api.rotation.copy(dummyEuler.setFromQuaternion(dummyQuat));
    if (!dummyScale.equals(scale)) {
      setScale(dummyScale.clone());
    }
  });

  return <group ref={group} />;
}
