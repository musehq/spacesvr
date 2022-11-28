import { MutableRefObject, useEffect, useMemo, useState } from "react";
import {
  MathUtils,
  NearestFilter,
  NoToneMapping,
  PerspectiveCamera,
  RGBAFormat,
  sRGBEncoding,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { useThree } from "@react-three/fiber";
import { useEnvironment } from "../../../layers/Environment";

type Photography = {
  resolution: Vector2;
  aspect: Vector2;
  takePicture: () => void;
  target: WebGLRenderTarget;
  fov: number;
};

export const usePhotography = (
  cam: MutableRefObject<PerspectiveCamera | undefined>,
  open: boolean
): Photography => {
  const { device } = useEnvironment();
  const { scene } = useThree();

  const [fov, setFov] = useState(50);
  useEffect(() => setFov(50), [open]);
  const resolution = useMemo(
    () => new Vector2(3, 2).normalize().multiplyScalar(2186),
    []
  );
  const aspect = useMemo(() => resolution.clone().normalize(), [resolution]);
  const target = useMemo(
    () =>
      new WebGLRenderTarget(resolution.x, resolution.y, {
        stencilBuffer: true, // text boxes look strange without this idk man
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
      }),
    [resolution]
  );
  const renderer = useMemo(() => {
    const r = new WebGLRenderer({
      preserveDrawingBuffer: true,
      precision: "highp",
      antialias: true,
    });
    r.physicallyCorrectLights = true;
    r.toneMapping = NoToneMapping;
    r.outputEncoding = sRGBEncoding;
    return r;
  }, []);

  useEffect(() => {
    renderer.setPixelRatio(device.desktop ? 2 : 1); // could be 3, just really fat
    renderer.setSize(target.width, target.height);
  }, [device.desktop, target.width, target.height, renderer]);

  useEffect(() => {
    // increase/decrease fov on scroll
    const onScroll = (e: WheelEvent) => {
      if (!cam.current) return;
      const fov = MathUtils.clamp(cam.current.fov + e.deltaY * 0.05, 10, 85);
      setFov(fov);
    };
    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
  }, [cam]);

  const takePicture = () => {
    if (!cam.current) return;

    document.body.append(renderer.domElement);
    cam.current.aspect = aspect.x / aspect.y;

    renderer.render(scene, cam.current);

    const link = document.createElement("a");
    const today = new Date();
    const name =
      document.title +
      " - www.muse.place" +
      window.location.pathname +
      " - " +
      today.toLocaleDateString("en-US") +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes();

    link.download = `${name}.jpg`;
    link.href = renderer.domElement.toDataURL("image/jpeg");
    link.click();

    link.remove();
    document.body.removeChild(renderer.domElement);
  };

  return { resolution, aspect, takePicture, target, fov };
};
