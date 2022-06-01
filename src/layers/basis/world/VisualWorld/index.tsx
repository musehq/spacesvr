import { useEffect, useMemo } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { DoubleSide, Color, MeshStandardMaterial, Uniform } from "three";
import { useLimiter } from "logic/limiter";
import { frag, fragHead, vert, vertHead } from "./materials/world";
import { World } from "../index";
import { Idea } from "../../idea";

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
  const HEX = world?.getHex() || "#808080";
  const SIZE: [number, number, number] =
    typeof size === "number"
      ? [size * 0.2, size * 0.2, size * 0.2]
      : [size[0] * 0.2, size[1] * 0.2, size[2] * 0.2];

  useFrame(({ clock }) => {
    if (!limiter.isReady(clock) || !mat || !mat.userData.shader) return;

    mat.userData.shader.uniforms.time.value =
      clock.getElapsedTime() + SEED * 1000;
  });

  useEffect(() => {
    COLOR.set(HEX);
  }, [HEX]);

  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({
      metalness: 0.18,
      roughness: 0.49,
      side: DoubleSide,
    });

    material.onBeforeCompile = function (shader) {
      const axiom = world ? world.getAxiom() : new Idea();

      const uniforms = {
        time: new Uniform(0),
        axiom: new Uniform(new Color(axiom.getHex())),
        up_norm: new Uniform(world?.getUpNorm()),
        range: new Uniform(world?.getRange()),
      };

      shader.uniforms = { ...shader.uniforms, ...uniforms };

      shader.vertexShader =
        vertHead +
        shader.vertexShader.replace(
          "#include <worldpos_vertex>",
          "#include <worldpos_vertex>\n" + vert
        );

      shader.fragmentShader =
        fragHead +
        shader.fragmentShader.replace(
          "#include <dithering_fragment>",
          "#include <dithering_fragment>\n" + frag
        );

      material.userData.shader = shader;
    };

    material.needsUpdate = true;

    return material;
  }, [vert, frag, vertHead, fragHead, world]);

  return (
    <group {...restProps}>
      <group scale={SIZE}>
        <mesh material={mat}>
          <sphereBufferGeometry args={[RADIUS, 64, 64]} />
        </mesh>
      </group>
    </group>
  );
}
