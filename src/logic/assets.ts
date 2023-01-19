import {
  CompressedTexture,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { suspend, preload, clear } from "suspend-react";
import { getFallbackTexture } from "./fallback";
import { GLTF } from "three-stdlib";

const KTX_CDN = "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/";

const textureLoader = new TextureLoader();
let ktx2loader: KTX2Loader | undefined;

const setupKtx2 = (gl: WebGLRenderer) => {
  if (ktx2loader) return;
  ktx2loader = new KTX2Loader();
  ktx2loader.setTranscoderPath(KTX_CDN);
  ktx2loader.detectSupport(gl);
};

function loadimage() {
  return function (url: string, gl: WebGLRenderer) {
    const IS_KTX2 = url.toLowerCase().endsWith("ktx2");
    setupKtx2(gl);
    const loader = IS_KTX2 ? ktx2loader! : textureLoader;
    return new Promise<Texture | CompressedTexture>((res) =>
      loader.load(url, res, undefined, (error) => {
        console.error(error);
        res(getFallbackTexture());
      })
    );
  };
}

/**
 * A single hook akin to useTexture but with ktx support
 *
 * KTX_CDN is from drei so that we don't download two separate transcoders when using the useKtx2 hook elsewhere
 * https://github.com/pmndrs/drei/blob/a2daf02853f624ef6062c70ba0b218bc03e5b626/src/core/useKTX2.tsx#L7
 * @param url
 */
export function useImage(url: string): Texture {
  const gl = useThree((st) => st.gl);
  return suspend(loadimage(), [url, gl]);
}

useImage.preload = function (url: string, gl: WebGLRenderer) {
  return preload(loadimage(), [url, gl]);
};

useImage.clear = function (url: string, gl: WebGLRenderer) {
  return clear([url, gl]);
};

/**
 * A hook to load gltf models with draco, meshopt, and ktx2 support out of the box
 *
 * For all cases, functionality is to only download decoder files if needed by the file
 * @param url
 */
export function useModel(url: string): GLTF {
  const gl = useThree((st) => st.gl);
  return useGLTF(url, true, true, (loader) => {
    setupKtx2(gl);
    loader.setKTX2Loader(ktx2loader!);
  });
}

useModel.preload = function (url: string, gl: WebGLRenderer) {
  return useGLTF.preload(url, true, true, (loader) => {
    setupKtx2(gl);
    loader.setKTX2Loader(ktx2loader!);
  });
};

useModel.clear = function (url: string) {
  return useGLTF.clear([url]);
};
