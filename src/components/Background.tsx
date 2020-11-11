import { Color } from "three";
import { useEffect, useState } from "react";
import { useThree } from "react-three-fiber";

type BackgroundProps = {
  color: Color | string | number;
};

export const Background = (props: BackgroundProps) => {
  const { color } = props;
  const { scene } = useThree();
  const [setup, setSetup] = useState(false);

  useEffect(() => {
    if (scene && !setup) {
      scene.background = new Color(color);
      setSetup(true);
    }
  }, [scene, setup]);

  return null;
};
