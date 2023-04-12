import { useEffect, useMemo, useRef, useState } from "react";
import { useLimitedFrame } from "../../../../logic/limiter";
import {
  Group,
  InstancedMesh,
  MathUtils,
  Object3D,
  SphereGeometry,
  Vector3,
} from "three";
import { useIdeaMaterial } from "../logic/ideaMat";
import { GroupProps, useThree } from "@react-three/fiber";

type BubblesProps = {
  numStops: number;
  enabled: boolean;
  offset: GroupProps["position"];
};

export default function Bubbles(props: BubblesProps) {
  const { numStops, enabled, offset } = props;

  const group = useRef<Group>(null);
  const mesh = useRef<InstancedMesh>(null);

  const clock = useThree((st) => st.clock);

  const [pos] = useState(new Vector3());
  const [obj] = useState(new Object3D());
  const startTime = useRef(0);
  useEffect(() => {
    startTime.current = clock.elapsedTime;
  }, [enabled]);
  useLimitedFrame(40, ({ clock }) => {
    if (!mesh.current || !group.current) return;

    group.current.updateMatrix();
    group.current.matrix.decompose(pos, obj.quaternion, obj.scale);
    for (let i = 0; i < numStops; i++) {
      const perc = i / (numStops - 1);
      obj.position.set(perc * pos.x, perc * pos.y, perc * pos.z);
      const sc = 0.8 + perc * 4;
      const delay = 60 / 1000;
      const time = 400 / 1000;
      const delta = clock.elapsedTime - startTime.current;
      const iter = enabled ? i : numStops - i - 1;
      const x = MathUtils.clamp((delta - iter * delay) / time, 0, 1);
      let val = (Math.cos(Math.PI * x) + 1) / 2;
      if (enabled) val = 1 - val;
      obj.scale.setScalar(sc * 0.2 * val);
      obj.updateMatrix();
      mesh.current.setMatrixAt(i, obj.matrix);
    }

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  const geo = useMemo(() => new SphereGeometry(0.05, 32, 16), []);
  const mat = useIdeaMaterial(undefined, 0.05);

  return (
    <>
      <group position={offset} ref={group} />
      <instancedMesh args={[geo, mat, numStops]} ref={mesh} />
    </>
  );
}
