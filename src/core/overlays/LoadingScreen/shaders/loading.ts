// @ts-ignore
import glsl from "babel-plugin-glsl/macro";

export const vert = glsl`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix 
          * modelViewMatrix 
          * vec4( position, 1.0 );
      }
`;

export const frag = glsl`
    uniform float time;
    uniform float amount;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
         
     #pragma glslify: noise = require('glsl-noise/simplex/3d')
     #pragma glslify: hsv2rgb = require(glsl-y-hsv/hsv2rgb)
     #pragma glslify: rgb2hsv = require(glsl-y-hsv/rgb2hsv)
     
     void main() {
       vec4 tex = texture2D( tDiffuse, vUv );
       vec3 color = tex.rgb;
       vec2 uv = vUv;
       
       float a = 0.85 + (noise(vec3(uv, time / 2.0)) + 1.0) / 2.0;
       a = min(a, 1.0);
       
       color = rgb2hsv(color);
       color.y += noise(vec3(uv, -time / 2.0));
       color = hsv2rgb(color);
       
       gl_FragColor = vec4( color, a);
     }
`;
