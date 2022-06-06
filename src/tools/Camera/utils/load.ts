import { useEnvironment } from "../../../layers/Environment";
import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useGLTF } from "@react-three/drei";

const TIMEOUT_UNTIL_DOWNLOAD = 2000; //ms

type ModelState = undefined | "loading" | "loaded" | "error";

export const useModelState = (
  url: string,
  timeout = TIMEOUT_UNTIL_DOWNLOAD
): ModelState => {
  const { device, paused } = useEnvironment();

  const [state, setState] = useState<ModelState>();

  // start loading model a certain amount of time after you start navigating the space
  useEffect(() => {
    if (!device.desktop || paused || state || !url) return;
    setState("loading");
    setTimeout(() => {
      new GLTFLoader().load(
        url,
        () => {
          setState("loaded");
          useGLTF.preload(url);
        },
        undefined,
        () => setState("error")
      );
    }, timeout);
  }, [state, paused, device.desktop, url, timeout]);

  return state;
};
