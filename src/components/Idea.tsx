import { useRef } from "react";
import { useFrame } from "react-three-fiber";
import Material from "component-material";
import { Sphere } from "@react-three/drei";
import { DoubleSide, Color } from "three";
// @ts-ignore
import glsl from "babel-plugin-glsl/macro";

type Props = {
  size?: number;
  perception?: number;
  vAlign?: "top" | "center" | "bottom";
} & JSX.IntrinsicElements["group"];

const RADIUS = 4;

/**
 * Pure Idea
 *
 *
 *
 * @param props
 * @constructor
 */
export const Idea = (props: Props) => {
  const { size = 1, perception = 0, vAlign = "bottom", ...restProps } = props;

  const material = useRef<typeof Material>();

  const radiusVariationAmplitude = 0.82;
  const radiusNoiseFrequency = 0.154;

  useFrame(({ clock }) => {
    if (!material.current) return;

    // @ts-ignore
    material.current["time"] = clock.getElapsedTime() / 6;
  });

  const posY = vAlign === "top" ? -RADIUS : vAlign === "bottom" ? RADIUS : 0;

  return (
    <group {...restProps}>
      <group scale={[size * 0.2, size * 0.2, size * 0.2]}>
        <Sphere args={[RADIUS, 128, 128]} position-y={posY}>
          <Material
            // @ts-ignore
            ref={material}
            metalness={0.18}
            clearcoat={0.17}
            roughness={0.49}
            envMapIntensity={0.66}
            side={DoubleSide}
            uniforms={{
              radius: { value: RADIUS, type: "float" },
              time: { value: 0, type: "float" },
              color: {
                value: new Color(
                  1 - perception,
                  1 - perception,
                  1 - perception
                ),
                type: "vec3",
              },
              radiusVariationAmplitude: {
                value: radiusVariationAmplitude,
                type: "float",
              },
              radiusNoiseFrequency: {
                value: radiusNoiseFrequency,
                type: "float",
              },
            }}
          >
            {/* @ts-ignore */}
            <Material.Vert.Head>
              {glsl`
                  #pragma glslify: snoise = require(glsl-noise-simplex/3d.glsl) 
                  float fsnoise(float val1, float val2, float val3){
                    return snoise(vec3(val1,val2,val3));
                  }
        
                  vec3 distortFunct(vec3 transformed, float factor) {
                    float radiusVariation = -fsnoise(
                      transformed.x * radiusNoiseFrequency + time,
                      transformed.y * radiusNoiseFrequency + time,
                      transformed.z * radiusNoiseFrequency + time 
                    ) * radiusVariationAmplitude * factor;
                    return normalize(transformed) * (radiusVariation + radius);
                  }
        
                  vec3 orthogonal(vec3 v) {
                    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                    : vec3(0.0, -v.z, v.y));
                  }
        
                  vec3 distortNormal(vec3 position, vec3 distortedPosition, vec3 normal){
                    vec3 tangent1 = orthogonal(normal);
                    vec3 tangent2 = normalize(cross(normal, tangent1));
                    vec3 nearby1 = position + tangent1 * 0.1;
                    vec3 nearby2 = position + tangent2 * 0.1;
                    vec3 distorted1 = distortFunct(nearby1, 1.0);
                    vec3 distorted2 = distortFunct(nearby2, 1.0);
                    return normalize(cross(distorted1 - distortedPosition, distorted2 - distortedPosition));
                  }
              `}
              {/* @ts-ignore */}
            </Material.Vert.Head>
            <Material.Vert.Body>{glsl`
                float updateTime = time / 10.0;
                transformed = distortFunct(transformed, 1.0);
                vec3 distortedNormal = distortNormal(position, transformed, normal);
                vNormal = normal + distortedNormal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed,1.);
              `}</Material.Vert.Body>
            <Material.Frag.Body>{glsl`
                gl_FragColor = vec4(gl_FragColor.rgb * color, gl_FragColor.a);  
            `}</Material.Frag.Body>
          </Material>
        </Sphere>
      </group>
    </group>
  );
};
