import { useEffect, useMemo } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { DoubleSide, Color, MeshStandardMaterial, Uniform } from "three";
import { useLimiter } from "../../../logic/limiter";
import { frag, fragHead, vert, vertHead } from "./materials/world";
import { World } from "../../../logic/basis/world";
import { Idea } from "../../../logic/basis/idea";

type VisualWorldProps = { world?: World } & GroupProps;

export function VisualWorld(props: VisualWorldProps) {
  const { world, ...rest } = props;

  const color = useMemo(() => new Color(), []);

  const RADIUS = 4;
  const SEED = useMemo(() => Math.random(), []);
  const HEX = world?.getHex() || "#808080";

  useEffect(() => {
    color.set(HEX);
  }, [HEX, color]);

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

  const limiter = useLimiter(50);
  useFrame(({ clock }) => {
    if (!limiter.isReady(clock) || !mat || !mat.userData.shader) return;

    mat.userData.shader.uniforms.time.value = clock.elapsedTime + SEED * 1000;
  });

  return (
    <group name="spacesvr-basis-world" {...rest}>
      <mesh material={mat} scale={0.2}>
        <sphereBufferGeometry args={[RADIUS, 48, 32]} />
      </mesh>
    </group>
  );
}
