export const vert = `
`;

const GRAY = "vec3(0.6)";

export const frag = `
    diffuseColor.rgb = ${GRAY};
    
    // apply grip
    float radius = 0.25;
    vec2 l = (fract((vUv - vec2(0.21, 0.)) * vec2(9., 0.)) - vec2(0.5, 0.));
    float blur = 5.;
    float circle_mask = 1.0 - smoothstep(radius - (radius * blur),radius + (radius * blur),dot(l,l) * 2.0);
    float side_mask = pow(abs(dot(vNorm, vec3(1.0, 0.0, 0.0))), 0.9);
    float up_mask = 0.2 * pow(dot(vNorm, vec3(0.0, 1.0, 0.0)), 1.);
    float grip_mask = min(1., (side_mask + up_mask)) * circle_mask;
    diffuseColor.rgb *= clamp(1. - (0.8 * grip_mask), 0., 1.);
    
    // apply speaker and mic
    // create mask for facing the camera
    float facing_mask = pow(clamp(dot(vNorm, vec3(0., 0., 1.0)), 0., 1.), 2000.);
    // create a mask for the bottom of the phone
    float bottom_mask = smoothstep(0.0, 0.2, abs(vUv.y + 0.1));
    float speaker_mask = facing_mask * bottom_mask;
    // diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.9), speaker_mask);
`;
