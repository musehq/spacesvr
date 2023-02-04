import { createPortal, useThree } from "@react-three/fiber";
import { CubeCamera, WebGLCubeRenderTarget } from "three";
import {
  MutableRefObject,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Suspense,
} from "react";
import { useToolbelt } from "../../../../layers/Toolbelt";

type LifecycleDetectorProps = {
  didMount: MutableRefObject<boolean>;
  setMounted: (d: boolean) => void;
};

// if the children suspense, this will call set done once suspense is resolved
function LifecycleDetector(props: LifecycleDetectorProps) {
  const { didMount, setMounted } = props;

  didMount.current = true;

  useEffect(() => {
    return () => {
      setMounted(true);
    };
  }, []);

  return null;
}

type ToolPreloadProps = {
  setPreloadDone: (done: boolean) => void;
  children: ReactNode;
};

// adapted from https://github.com/pmndrs/drei/blob/master/src/core/Preload.tsx
export default function ToolPreload(props: ToolPreloadProps) {
  const { setPreloadDone, children } = props;

  const gl = useThree(({ gl }) => gl);
  const camera = useThree(({ camera }) => camera);
  const { hudScene } = useToolbelt();

  const didMount = useRef(false);
  const [firstRender, setFirstRender] = useState(true);
  const [mounted, setMounted] = useState(false);

  // if the children don't suspense, the second render will detect that and mark it as finished
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    if (!didMount.current) {
      // mounted with no suspense trigger, so UnloadComponent will never be called
      setMounted(true);
    }
  }, [firstRender]);

  // Layout effect because it must run before React commits
  useLayoutEffect(() => {
    if (!mounted) return;

    // compile the scene, then hit it with a cube camera
    gl.compile(hudScene, camera);
    const cubeRenderTarget = new WebGLCubeRenderTarget(128);
    const cubeCamera = new CubeCamera(0.01, 100000, cubeRenderTarget);
    cubeCamera.update(gl, hudScene);
    cubeRenderTarget.dispose();

    setPreloadDone(true);
  }, [camera, gl, hudScene, mounted, setPreloadDone]);

  return createPortal(
    <group name="tool-preload">
      <Suspense
        fallback={
          <LifecycleDetector didMount={didMount} setMounted={setMounted} />
        }
      >
        {children}
      </Suspense>
    </group>,
    hudScene
  );
}
