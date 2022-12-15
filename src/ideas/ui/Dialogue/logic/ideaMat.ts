import { useMemo } from "react";
import { Idea } from "../../../../logic/basis";
import { useLimitedFrame } from "../../../../logic/limiter";
import { Color, DoubleSide, MeshStandardMaterial, Uniform } from "three";
import { useSpring } from "@react-spring/three";

export const useIdeaMaterial = (idea: Idea | undefined, radius: number) => {
  const hex = useMemo(() => idea?.getHex() || "#808080", [idea]);
  const seed = useMemo(() => Math.random(), []);
  const color = useMemo(() => new Color(hex), [hex]);

  const { col } = useSpring({ col: hex });

  const NOISE_AMPLITUDE = radius * 0.32;
  const NOISE_FREQ = 0.554 / radius;

  const mat = useMemo(() => {
    const material = new MeshStandardMaterial({
      metalness: 0.18,
      roughness: 0.49,
      envMapIntensity: 0.66,
      side: DoubleSide,
    });

    material.onBeforeCompile = function (shader) {
      shader.uniforms.radius = new Uniform(radius);
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
  }, [radius, color, NOISE_AMPLITUDE, NOISE_FREQ, frag, vert]);

  useLimitedFrame(50, ({ clock }) => {
    if (!mat?.userData?.shader) return;

    mat.userData.shader.uniforms.time.value =
      clock.elapsedTime / 6 + seed * 100;

    mat.userData.shader.uniforms.color.value.set(col.get());
  });

  return mat;
};

export const vertHead = `
    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //
    
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v)
      {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
    
    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
    
    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
      }
              
    
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
`;

export const vert = `
    #include <begin_vertex>
    float updateTime = time / 10.0;
    transformed = distortFunct(transformed, 1.0);
    vec3 distortedNormal = distortNormal(position, transformed, normal);
    vNormal = normal + distortedNormal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed,1.);
`;

export const frag = `
    #include <dithering_fragment>
    float angle = clamp(dot(normalize(vNormal), vec3(0., -1., 0.)), 0., 1.);
    gl_FragColor = vec4(gl_FragColor.rgb * color, gl_FragColor.a);  
    gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(color, vec3(0.), 0.5), angle);
`;
