import { useFrame, useThree } from "react-three-fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { frag, vert } from "../shaders/loading";

const Effects = () => {
  const { gl, scene, camera, size } = useThree();

  // composer
  const composer = useRef<EffectComposer>();
  useEffect(() => composer?.current?.setSize(size.width, size.height), [size]);

  // fxaa
  const fxaaPass = new ShaderPass(FXAAShader);
  const fxaaUniforms = fxaaPass.material.uniforms["resolution"];
  const pixelRatio = window ? window.devicePixelRatio : 2;
  fxaaUniforms.value.x = 1 / (size.width * pixelRatio);
  fxaaUniforms.value.y = 1 / (size.height * pixelRatio);

  // loading
  const loadingPass = useMemo(
    () =>
      new ShaderPass({
        uniforms: {
          amount: { value: 0 },
          time: { value: 0 },
          tDiffuse: { value: null },
        },
        vertexShader: vert,
        fragmentShader: frag,
      }),
    [vert, frag]
  );

  useEffect(() => {
    if (!composer.current) return;

    fxaaPass.renderToScreen = false;
    composer.current.addPass(fxaaPass);
    loadingPass.renderToScreen = true;
    composer.current.addPass(loadingPass);
  }, [loadingPass]);

  useFrame(({ clock }) => {
    if (!composer.current) return;

    loadingPass.uniforms["time"].value = clock.getElapsedTime();

    composer.current.render();
  }, 1);

  return (
    <>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" args={[scene, camera]} />
      </effectComposer>
    </>
  );
};

export default Effects;
