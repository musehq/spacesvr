import { useEffect, useMemo, useRef } from "react";
import { FontLoader, Vector3, Mesh, Material } from "three";
import { GroupProps, useLoader } from "@react-three/fiber";

const FONT_FILE = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Coolvetica.json";

type TextProps = {
  text: string;
  vAlign?: "center" | "top" | "bottom";
  hAlign?: "center" | "left" | "right";
  size?: number;
  color?: string;
  bevel?: boolean;
  font?: string;
  material?: Material;
} & GroupProps;

export function Text(props: TextProps) {
  const {
    text,
    vAlign = "center",
    hAlign = "center",
    size = 1,
    bevel = false,
    color = "#000000",
    font: fontFile,
    material,
    ...rest
  } = props;

  const font = useLoader(FontLoader, fontFile || FONT_FILE);
  const mesh = useRef<Mesh>();

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

  useEffect(() => {
    if (!mesh.current) return;

    const size = new Vector3();
    mesh.current.geometry.computeBoundingBox();
    mesh.current.geometry?.boundingBox?.getSize(size);
    mesh.current.position.x =
      hAlign === "center" ? -size.x / 2 : hAlign === "right" ? 0 : -size.x;
    mesh.current.position.y =
      vAlign === "center" ? -size.y / 2 : vAlign === "top" ? 0 : -size.y;
  }, [text]);

  return (
    <group name="spacesvr-text" {...rest} scale={[0.1 * size, 0.1 * size, 0.1]}>
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
}
