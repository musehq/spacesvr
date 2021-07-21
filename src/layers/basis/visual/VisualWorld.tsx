import { useEffect, useMemo } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { DoubleSide, Color, ShaderMaterial } from "three";
import { useLimiter } from "spacesvr";
import { frag, vert } from "./shaders/world";
import { World } from "../classes/world";

type Props = {
  size?: number | [number, number, number];
  world?: World;
} & GroupProps;

/**
 * Pure Idea
 *
 *
 *
 * @param props
 * @constructor
 */
export function VisualWorld(props: Props) {
  const { size = 1, world, ...restProps } = props;

  const limiter = useLimiter(50);

  const SEED = useMemo(() => Math.random(), []);
  const COLOR = useMemo(() => new Color(), []);
  const RADIUS = 4;
  const NOISE_AMPLITUDE = 0.82;
  const NOISE_FREQ = 0.154;
  const HEX = world?.getHex() || "#808080";
  const SIZE: [number, number, number] =
    typeof size === "number"
      ? [size * 0.2, size * 0.2, size * 0.2]
      : [size[0] * 0.2, size[1] * 0.2, size[2] * 0.2];

  useFrame(({ clock }) => {
    if (!mat || !limiter.isReady(clock)) return;

    mat.uniforms["time"].value = clock.getElapsedTime() / 6 + SEED * 1000;
  });

  useEffect(() => {
    COLOR.set(HEX);
  }, [HEX]);

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          radius: { value: RADIUS },
          time: { value: 0 },
          color: { value: COLOR },
          radiusVariationAmplitude: { value: NOISE_AMPLITUDE },
          radiusNoiseFrequency: { value: NOISE_FREQ },
        },
        side: DoubleSide,
        vertexShader: vert,
        fragmentShader: frag,
      }),
    [vert, frag]
  );

  return (
    <group {...restProps}>
      <group scale={SIZE}>
        <mesh material={mat}>
          <sphereBufferGeometry args={[RADIUS, 64, 32]} />
        </mesh>
      </group>
    </group>
  );
}
