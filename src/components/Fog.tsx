import { useEffect } from "react";
import { useThree } from "react-three-fiber";
import * as THREE from "three";

type FogProps = {
  color: THREE.Color;
  near: number;
  far: number;
};

export const Fog = (props: FogProps) => {
  const { color, near, far } = props;

  const { scene } = useThree();

  useEffect(() => {
    console.log("new fog!");
    scene.fog = new THREE.Fog(color, near, far);
  }, [scene, color, near, far]);

  return <></>;
};
