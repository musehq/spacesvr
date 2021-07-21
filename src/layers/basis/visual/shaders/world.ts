export const vert = `
    precision highp float;
    uniform float radius;
    uniform float time;
    uniform vec3 color;
    uniform float radiusVariationAmplitude;
    uniform float radiusNoiseFrequency;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    
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
        
    void main () {
        vUv = uv;
        float updateTime = time / 10.0;
        vec3 transformed = position;
        transformed = distortFunct(transformed, 1.0);
        vec3 distortedNormal = distortNormal(position, transformed, normal);
        vNormal = normal + distortedNormal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed,1.);
    } 
`;

export const frag = `
    precision highp float;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    uniform float radius;
    uniform float time;
    uniform vec3 color;
    uniform float radiusVariationAmplitude;
    uniform float radiusNoiseFrequency;

    
    #define TAU 6.28318530718
    #define MAX_ITER 5  
    
    vec3 getCaustic() {
        vec2 uv = vUv;
        
        #ifdef SHOW_TILING
        vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
        #else
        vec2 p = mod(uv*TAU, TAU)-250.0;
        #endif
        
        vec2 i = vec2(p);
        float c = 1.0;
        float inten = .005;
        
        for (int n = 0; n < MAX_ITER; n++) 
        {
          float t = time * (1.0 - (3.5 / float(n+1)));
          i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
          c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
        }
        
        c /= float(MAX_ITER);
        c = 1.17-pow(c, 1.4);
        vec3 colour = vec3(pow(abs(c), 8.0));
            colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
            
        
        #ifdef SHOW_TILING
        // Flash tile borders...
        vec2 pixel = 2.0 / vec2(200., 200.);
        uv *= 2.0;
        
        float f = floor(mod(time*.5, 2.0)); // Flash value.
        vec2 first = step(pixel, uv) * f;   // Rule out first screen pixels and flash.
        uv  = step(fract(uv), pixel);// Add one line of pixels per tile.
        colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
        
        #endif
        return colour;
    }
    
    
    #define iterations 11
    #define formuparam 0.53
    
    #define volsteps 8
    #define stepsize 0.1
    
    #define zoom   1.300
    #define tile   0.820
    #define speed  0.04 
    
    #define brightness 0.0015
    #define darkmatter 0.100
    #define distfading 0.470
    #define saturation 1.450
    
    // https://www.shadertoy.com/view/Nt23zh
    vec3 getSpace(){
        //get coords and direction
        vec2 uv = vec2(sin(vUv.x * 3.1415 * 2.), vUv.y);
        vec3 dir = vec3(uv* zoom, 1.);
        float locTime = time * speed;
        
        //mouse rotation
        vec2 mouse = vec2(0.5, 0.5);
        float a1=.5+mouse.x;
        float a2=.8+mouse.y;
        mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
        mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
        dir.xz*=rot1;
        dir.xy*=rot2;
        vec3 from=vec3(1.,.5,0.5);
        from+=vec3(locTime*2.,locTime,-2.);
        from.xz*=rot1;
        from.xy*=rot2;
        
        //volumetric rendering
        float s=0.1,fade=1.;
        vec3 v=vec3(0.);
        for (int r=0; r<volsteps; r++) {
            vec3 p=from+s*dir*.5;
            p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
            float pa,a=pa=0.;
            for (int i=0; i<iterations; i++) { 
            p=abs(p)/dot(p,p)-formuparam; // the magic formula
            a+=abs(length(p)-pa); // absolute sum of average change
            pa=length(p);
        }
        float dm=max(0.,darkmatter-a*a*.001); //dark matter
        a*=a*a; // add contrast
        if (r>6) fade*=1.-dm; // dark matter, don't render near
            //v+=vec3(dm,dm*.5,0.);
            v+=fade;
            v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
            fade*=distfading; // distance fading
            s+=stepsize;
        }
        v=mix(vec3(length(v)),v,saturation); //color adjust
        return vec3(1.0 - v * 0.1);
    }
    
    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    
    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    // try https://www.shadertoy.com/view/7lj3Rh
    
    void main(){
        float angle = clamp(dot(normalize(vNormal), vec3(0., -1., 0.)), 0., 1.);
        // gl_FragColor = vec4(gl_FragColor.rgb * color, gl_FragColor.a);
        gl_FragColor.rgb = getSpace();
        gl_FragColor.a = 1.;
        
        vec3 idea_hsv = rgb2hsv(color);
        vec3 space_hsv = rgb2hsv(gl_FragColor.rgb);
        
        space_hsv.x = mix(space_hsv.x, idea_hsv.x, 0.5);
        space_hsv.y = mix(space_hsv.y, idea_hsv.y, 0.05);
        space_hsv.z = mix(space_hsv.z, idea_hsv.z, 0.1);
        
        gl_FragColor.rgb = hsv2rgb(space_hsv);
        
        gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(gl_FragColor.rgb, vec3(0.), 0.5), angle);
    }
`;
