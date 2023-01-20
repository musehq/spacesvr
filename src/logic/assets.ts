import { CompressedTexture, Texture, TextureLoader } from "three";
import { WebGLExtensions } from "three/src/renderers/webgl/WebGLExtensions";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { useGLTF } from "@react-three/drei";
import { suspend, preload, clear } from "suspend-react";
import { getFallbackTexture } from "./fallback";
import { GLTF } from "three-stdlib";

const KTX_CDN = "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/";

const textureLoader = new TextureLoader();
let ktx2loader: KTX2Loader | undefined;

// it's inconvenient to have to produce a gl object to check for ktx2 support, especially when it comes to the cache keys
// solution is to create a skeleton object that provides the minimum requirements to check for ktx support, defined below
// https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/KTX2Loader.js#L113-L135
type PotentialCanvas = WebGLRenderingContext | WebGL2RenderingContext | null;
type KTXSupportCheck = {
  capabilities: { isWebGL2: boolean };
  extensions: WebGLExtensions;
};
const setupKtx2 = () => {
  if (ktx2loader) return;

  ktx2loader = new KTX2Loader();
  ktx2loader.setTranscoderPath(KTX_CDN);

  let supportsWebgl2: boolean;
  const el = document.createElement("canvas");
  let gl: PotentialCanvas = el.getContext("webgl2");
  if (gl) {
    supportsWebgl2 = true;
  } else {
    gl = el.getContext("webgl");
    supportsWebgl2 = false;
  }
  if (!gl) {
    throw new Error("No WebGL support");
  }
  el.remove();
  const minimumGL: KTXSupportCheck = {
    extensions: new WebGLExtensions(gl),
    capabilities: { isWebGL2: supportsWebgl2 },
  };

  // @ts-ignore
  ktx2loader.detectSupport(minimumGL);
};

function loadimage() {
  return function (url: string) {
    const IS_KTX2 = url.toLowerCase().endsWith("ktx2");
    setupKtx2();
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
  return suspend(loadimage(), [url]);
}

useImage.preload = function (url: string) {
  return preload(loadimage(), [url]);
};

useImage.clear = function (url: string) {
  return clear([url]);
};

/**
 * A hook to load gltf models with draco, meshopt, and ktx2 support out of the box
 *
 * For all cases, functionality is to only download decoder files if needed by the file
 * @param url
 */
export function useModel(url: string): GLTF {
  return useGLTF(url, true, true, (loader) => {
    setupKtx2();
    loader.setKTX2Loader(ktx2loader!);
  });
}

useModel.preload = function (url: string) {
  return useGLTF.preload(url, true, true, (loader) => {
    setupKtx2();
    loader.setKTX2Loader(ktx2loader!);
  });
};

useModel.clear = function (url: string) {
  return useGLTF.clear([url]);
};
