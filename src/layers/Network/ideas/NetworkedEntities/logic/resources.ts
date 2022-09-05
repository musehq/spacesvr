import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { AudioListener, Object3D } from "three";

export const useListener = (): AudioListener => {
  const cam = useThree((st) => st.camera);
  return useMemo(() => {
    const listen = new AudioListener();
    cam.add(listen);
    return listen;
  }, [cam]);
};

export const useObj = (): Object3D => {
  return useMemo(() => {
    const o = new Object3D();
    o.matrixAutoUpdate = false;
    return o;
  }, []);
};
