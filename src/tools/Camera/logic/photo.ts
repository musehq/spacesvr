import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
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

export type Photography = {
  resolution: Vector2;
  aspect: Vector2;
  takePicture: () => void;
  renderer: WebGLRenderer;
  target: WebGLRenderTarget;
  data: { value?: string; set: (v: string | undefined) => void };
};

export const usePhotography = (
  cam: MutableRefObject<PerspectiveCamera | undefined>
): Photography => {
  const { device } = useEnvironment();
  const { scene } = useThree();

  const [data, setData] = useState<string>();

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
    r.useLegacyLights = false;
    r.toneMapping = NoToneMapping;
    r.outputEncoding = sRGBEncoding;
    return r;
  }, []);

  useEffect(() => {
    renderer.setSize(target.width, target.height);
    renderer.setPixelRatio(device.desktop ? 2 : 1); // could be 3, just really fat
  }, [device.desktop, target.width, target.height, renderer]);

  const takePicture = useCallback(() => {
    if (!cam.current) return;

    document.body.append(renderer.domElement);
    cam.current.aspect = aspect.x / aspect.y;

    renderer.render(scene, cam.current);

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

    if (!device.mobile) {
      const link = document.createElement("a");
      link.download = `${name}.jpg`;
      link.href = renderer.domElement.toDataURL("image/jpeg");
      link.click();
      link.remove();
    } else {
      setData(renderer.domElement.toDataURL("image/jpeg"));
    }

    document.body.removeChild(renderer.domElement);
  }, [aspect.x, aspect.y, cam, device.mobile, renderer, scene]);

  return {
    resolution,
    aspect,
    takePicture,
    target,
    renderer,
    data: { value: data, set: setData },
  };
};
