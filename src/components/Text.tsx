import { useMemo } from "react";
import { FontLoader, Vector3 } from "three";
import { useLoader, useUpdate } from "react-three-fiber";
import * as THREE from "three";

const FONT_FILE = "fonts/Couture_Bold.json";

type TextProps = JSX.IntrinsicElements["group"] & {
  text: string;
  vAlign?: "center" | "top" | "bottom";
  hAlign?: "center" | "left" | "right";
  size?: number;
  color?: string;
  bevel?: boolean;
  font?: string;
  material?: THREE.Material;
};

export const Text = (props: TextProps) => {
  const {
    text,
    vAlign = "center",
    hAlign = "center",
    size = 1,
    bevel = false,
    color = "#000000",
    font: fontFile,
    material,
    ...restProps
  } = props;

  const font = useLoader(FontLoader, fontFile || FONT_FILE);

  const config = useMemo(
    () => ({
      font,
      size,
      height: 0.75 * size,
      curveSegments: 32,
      bevelEnabled: bevel,
      bevelThickness: 0.15 * size,
      bevelSize: 0.0625 * size,
      bevelOffset: 0,
      bevelSegments: 8,
    }),
    [font]
  );

  const mesh = useUpdate(
    (self: any) => {
      const size = new Vector3();
      self.geometry.computeBoundingBox();
      self.geometry.boundingBox.getSize(size);
      self.position.x =
        hAlign === "center" ? -size.x / 2 : hAlign === "right" ? 0 : -size.x;
      self.position.y =
        vAlign === "center" ? -size.y / 2 : vAlign === "top" ? 0 : -size.y;
    },
    [text]
  );

  return (
    <group {...restProps} scale={[0.1 * size, 0.1 * size, 0.1]}>
      <mesh ref={mesh} material={material}>
        <textGeometry attach="geometry" args={[text, config]} />
        {!material && (
          <meshPhongMaterial
            attach="material"
            color={color}
            reflectivity={30}
          />
        )}
      </mesh>
    </group>
  );
};
