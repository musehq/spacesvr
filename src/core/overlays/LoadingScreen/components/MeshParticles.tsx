import { useMemo, useRef } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import { InstancedMesh } from "three";

type Props = {
  count: number;
} & JSX.IntrinsicElements["group"];

const Particles = (props: Props) => {
  const { count, ...restProps } = props;

  const mesh = useRef<InstancedMesh>();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.0001 + Math.random() / 20000;
      const xFactor = -5 + Math.random() * 10;
      const yFactor = -1 + Math.random() * 7;
      const zFactor = -5 + Math.random() * 10;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  // The innards of this hook will run every frame
  useFrame((state) => {
    // Run through the randomized data to calculate some movement
    particles.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      let { t } = particle;
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      // And apply the matrix to the instanced item
      mesh?.current?.setMatrixAt(i, dummy.matrix);
    });

    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group {...restProps}>
      {/* @ts-ignore */}
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronBufferGeometry args={[0.008, 0]} />
        <meshPhongMaterial reflectivity={1} color="yellow" />
      </instancedMesh>
    </group>
  );
};

export default Particles;
