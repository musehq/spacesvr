import { MutableRefObject, useMemo } from "react";
import {
  ACESFilmicToneMapping,
  NearestFilter,
  PerspectiveCamera,
  RGBAFormat,
  sRGBEncoding,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { useThree } from "@react-three/fiber";

type Photography = {
  resolution: Vector2;
  aspect: Vector2;
  takePicture: () => void;
  target: WebGLRenderTarget;
};

export const usePhotography = (
  cam: MutableRefObject<PerspectiveCamera | undefined>
): Photography => {
  const { scene } = useThree();

  const resolution = useMemo(
    () => new Vector2(3, 2).normalize().multiplyScalar(2186),
    []
  );

  const aspect = useMemo(() => resolution.clone().normalize(), [resolution]);

  const target = useMemo(
    () =>
      new WebGLRenderTarget(resolution.x, resolution.y, {
        stencilBuffer: true,
        minFilter: NearestFilter,
        magFilter: NearestFilter,
        format: RGBAFormat,
      }),
    [resolution]
  );

  const takePicture = () => {
    if (!cam.current) return;

    const r = new WebGLRenderer({
      preserveDrawingBuffer: true,
      precision: "highp",
      antialias: true,
    });
    r.physicallyCorrectLights = false;
    r.setPixelRatio(2); // could be 3, just really fat
    r.setSize(target.width, target.height);
    r.outputEncoding = sRGBEncoding;
    r.toneMapping = ACESFilmicToneMapping;

    document.body.append(r.domElement);

    r.render(scene, cam.current);

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

    link.download = `${name}.png`;
    link.href = r.domElement.toDataURL("image/png");
    link.click();

    link.remove();
    document.body.removeChild(r.domElement);
    r.dispose();
  };

  return { resolution, aspect, takePicture, target };
};
