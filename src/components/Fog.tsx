import { useEffect, useState } from "react";
import { Color, useThree } from "react-three-fiber";
import * as THREE from "three";

type FogProps = {
  color: Color;
  near: number;
  far: number;
};

export const Fog = (props: FogProps) => {
  const { color, near, far } = props;

  const { scene } = useThree();
  const [setup, setSetup] = useState(false);

  useEffect(() => {
    if (scene && !setup) {
      scene.fog = new THREE.Fog(color, near, far);
      setSetup(true);
    }
  }, [scene, setup]);

  return null;
};
