import { useEffect, useMemo } from "react";
import { GroupProps } from "@react-three/fiber";
import {
  DoubleSide,
  Color,
  MeshStandardMaterial,
  Uniform,
  Vector3,
} from "three";
import { useLimitedFrame } from "../../../logic/limiter";
import { frag, fragHead, vert, vertHead } from "./materials/world";
import { World } from "../../../logic/basis/world";
import { Idea } from "../../../logic/basis/idea";

type VisualWorldProps = { world?: World } & GroupProps;

export function VisualWorld(props: VisualWorldProps) {
  const { world, ...rest } = props;

  const RADIUS = 4;
  const SEED = useMemo(() => Math.random(), []);

  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({
      metalness: 0.18,
      roughness: 0.49,
      side: DoubleSide,
    });

    material.onBeforeCompile = function (shader) {
      const uniforms = {
        time: new Uniform(0),
        axiom: new Uniform(new Color("#888888")),
        up_norm: new Uniform(new Vector3(0, 1, 0)),
        range: new Uniform(0),
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
  }, []);

  useEffect(() => {
    if (!mat || !mat.userData.shader || !world) return;

    const unifs = mat.userData.shader.uniforms;
    const axiom = world ? world.getAxiom() : new Idea();
    unifs.axiom.value.set(new Color(axiom.getHex()));
    unifs.up_norm.value = world?.getUpNorm();
    unifs.range.value = world?.getRange();
  }, [world, mat]);

  useLimitedFrame(50, ({ clock }) => {
    if (!mat || !mat.userData.shader) return;

    mat.userData.shader.uniforms.time.value = clock.elapsedTime + SEED * 500;
  });

  return (
    <group name="spacesvr-basis-world" {...rest}>
      <mesh material={mat} scale={0.2}>
        <sphereBufferGeometry args={[RADIUS, 48, 32]} />
      </mesh>
    </group>
  );
}
