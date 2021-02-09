import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";

let min = 1000000;
let max = -10000000;

const MIN_DISP = -0.2;
const MAX_DISP = 0.85;

const ReactivePrimitive = (props) => {
  const { url, aa } = props;

  const seed = useMemo(() => Math.random(), []);
  const texture = useLoader(THREE.TextureLoader, url);
  const group = useRef();
  const innerGroup = useRef();
  const material = useRef();
  const freqIndex = useRef(Math.floor(Math.random() * 16));

  useFrame(({ clock }) => {
    if (material.current) {
      const freqData = aa?.getFrequencyData()[freqIndex.current] || 0;

      if (freqData < min) {
        min = freqData;
      }

      if (freqData > max) {
        max = freqData;
      }

      const modFreqData = (freqData - min) / (max - min);

      const disp = THREE.MathUtils.lerp(MIN_DISP, MAX_DISP, modFreqData);

      material.current.displacementScale = disp;
    }

    if (group.current) {
      group.current.rotation.x = clock.getElapsedTime() / (7 + seed * 30);
      group.current.rotation.y = clock.getElapsedTime() / (10 + seed * 30);
      group.current.rotation.z = clock.getElapsedTime() / (9 + seed * 30);
    }
  });

  const SCALE = 0.6;

  return (
    <group scale={[SCALE, SCALE, SCALE]} position={[-1, 1.2, 5.2]}>
      <group {...props} ref={group}>
        <group ref={innerGroup}>
          <mesh>
            <boxBufferGeometry args={[2, 2, 2, 40, 40, 40]} />
            <meshStandardMaterial
              ref={material}
              map={texture}
              displacementMap={texture}
              displacementScale={0}
            />
          </mesh>
          <mesh scale={[1 + MIN_DISP, 1 + MIN_DISP, 1 + MIN_DISP]}>
            <boxBufferGeometry args={[2, 2, 2, 40, 40, 40]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default ReactivePrimitive;
