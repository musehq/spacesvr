import { RGBAFormat, WebGLRenderTarget, UnsignedByteType } from "three";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { EffectComposer, RenderPass, ShaderPass } from "three-stdlib";
import {
  Children,
  cloneElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type EffectsProps = { children: ReactNode | ReactNode[] };

/**
 *  Lots of code copied from https://github.com/pmndrs/drei/blob/master/src/core/Effects.tsx
 */
export function Effects(props: EffectsProps) {
  const { children } = props;

  useMemo(() => extend({ EffectComposer, RenderPass, ShaderPass }), []);
  const composer = useRef<EffectComposer>(null);
  const { scene, camera, gl, size, viewport } = useThree();
  const [target] = useState(() => {
    const t = new WebGLRenderTarget(size.width, size.height, {
      type: UnsignedByteType,
      format: RGBAFormat,
      encoding: gl.outputEncoding,
      depthBuffer: true,
      stencilBuffer: true,
      anisotropy: 2,
    });
    t.samples = 4;
    return t;
  });

  useEffect(() => {
    composer.current?.setSize(size.width, size.height);
    composer.current?.setPixelRatio(viewport.dpr);
  }, [gl, size, viewport.dpr]);

  useFrame(() => {
    if (!composer.current) return;
    // remove undefined passes
    composer.current.passes = composer.current.passes.filter(
      (pass) => pass !== undefined
    );
    composer.current?.render();
  }, 1);

  // build passes array
  const passes: React.ReactNode[] = [];
  passes.push(
    <renderPass
      key="renderpass"
      attach={`passes-${passes.length}`}
      args={[scene, camera]}
    />
  );
  Children.forEach(children, (el: any) => {
    el &&
      passes.push(
        cloneElement(el, {
          key: passes.length,
          attach: `passes-${passes.length}`,
        })
      );
  });

  return (
    <effectComposer ref={composer} args={[gl, target]}>
      {passes}
    </effectComposer>
  );
}
