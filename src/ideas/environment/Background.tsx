import { Color, ColorRepresentation } from "three";
import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";

type BackgroundProps = {
  color: ColorRepresentation;
};

export function Background(props: BackgroundProps) {
  const { color } = props;

  const scene = useThree((state) => state.scene);

  useLayoutEffect(() => {
    const oldBackground = scene.background;
    const col = (color as Color) instanceof Color ? color : new Color(color);
    scene.background = col as Color;

    return () => {
      scene.background = oldBackground;
    };
  }, [color]);

  return null;
}
