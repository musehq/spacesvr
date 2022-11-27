import { MeshStandardMaterialParameters } from "three/src/materials/MeshStandardMaterial";
import { useMemo } from "react";
import { DoubleSide, MeshStandardMaterial, Uniform } from "three";
import { useLimitedFrame } from "./limiter";

export const useModifiedStandardShader = (
  config: MeshStandardMaterialParameters & { time?: boolean },
  vert: string,
  frag: string
) => {
  const { time = true, ...rest } = config;

  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({ side: DoubleSide, ...rest });

    material.onBeforeCompile = function (shader) {
      shader.uniforms.time = new Uniform(0);

      const uniforms = `
        varying vec2 vUv;
        varying vec3 vNorm;
        varying vec3 vPos;
        uniform float time;
      `;
      const varyingSet = `
        vUv = uv;
        vPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
      `;

      shader.vertexShader =
        uniforms +
        shader.vertexShader.replace(
          "#include <worldpos_vertex>",
          vert + varyingSet + "\n#include <worldpos_vertex>\n"
        );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n" + "vNorm = normal;\n"
      );

      // gets inserted right here: https://github.com/mrdoob/three.js/blob/f16386d8bb3db60ce4f6254ccf006c2e0b90bc1c/src/renderers/shaders/ShaderLib/meshphysical.glsl.js#L171
      shader.fragmentShader =
        uniforms +
        shader.fragmentShader.replace(
          "#include <emissivemap_fragment>",
          "#include <emissivemap_fragment>\n" + frag
        );

      material.userData.shader = shader;
    };

    material.customProgramCacheKey = () => frag + vert + JSON.stringify(rest);

    return material;
  }, [frag, rest, time, vert]);

  useLimitedFrame(70, ({ clock }) => {
    if (!time || !mat.userData.shader?.uniforms?.time) return;
    mat.userData.shader.uniforms.time.value = clock.elapsedTime;
  });

  return mat;
};
