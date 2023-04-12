import { useMemo } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { DoubleSide, Color, Uniform, MeshStandardMaterial } from "three";
import { Idea } from "../../../logic/basis/idea";
import { frag, vert, vertHead } from "./materials/idea";
import { useSpring } from "@react-spring/three";
import { useLimiter } from "../../../logic/limiter";

type VisualIdeaProps = { idea?: Idea } & GroupProps;

export function VisualIdea(props: VisualIdeaProps) {
  const { idea, ...rest } = props;

  const hex = useMemo(() => idea?.getHex() || "#808080", [idea]);
  const seed = useMemo(() => Math.random(), []);
  const color = useMemo(() => new Color(hex), [hex]);

  const RADIUS = 4;
  const NOISE_AMPLITUDE = 0.82;
  const NOISE_FREQ = 0.154;

  const { col } = useSpring({ col: hex });

  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({
      metalness: 0.18,
      roughness: 0.49,
      envMapIntensity: 0.66,
      side: DoubleSide,
    });

    material.onBeforeCompile = function (shader) {
      shader.uniforms.radius = new Uniform(RADIUS);
      shader.uniforms.time = new Uniform(0);
      shader.uniforms.color = new Uniform(color);
      shader.uniforms.radiusVariationAmplitude = new Uniform(NOISE_AMPLITUDE);
      shader.uniforms.radiusNoiseFrequency = new Uniform(NOISE_FREQ);

      const uniforms = `
        uniform float radius;
        uniform float time;
        uniform vec3 color;
        uniform float radiusVariationAmplitude;
        uniform float radiusNoiseFrequency;
      `;

      shader.vertexShader =
        uniforms +
        vertHead +
        shader.vertexShader.replace("#include <begin_vertex>", vert);

      shader.fragmentShader =
        uniforms +
        shader.fragmentShader.replace("#include <dithering_fragment>", frag);

      material.userData.shader = shader;
    };

    return material;
  }, [RADIUS, color, NOISE_AMPLITUDE, NOISE_FREQ, frag, vert]);

  const limiter = useLimiter(50);
  useFrame(({ clock }) => {
    if (!mat?.userData?.shader || !limiter.isReady(clock)) return;

    mat.userData.shader.uniforms.time.value =
      clock.elapsedTime / 6 + seed * 1000;

    mat.userData.shader.uniforms.color.value.set(col.get());
  });

  return (
    <group name="spacesvr-basis-idea" {...rest}>
      <mesh material={mat} scale={0.2}>
        <sphereGeometry args={[RADIUS, 48, 32]} />
      </mesh>
    </group>
  );
}
