import { Color } from "three";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

type BackgroundProps = {
  color: Color | string | number;
};

export function Background(props: BackgroundProps) {
  const { color } = props;

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const col = (color as Color) instanceof Color ? color : new Color(color);
    scene.background = col as Color;

    return () => {
      scene.background = null;
    };
  }, [color, scene]);

  return null;
}
