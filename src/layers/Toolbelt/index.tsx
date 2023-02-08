import { ReactNode, useState } from "react";
import ToolSwitcher from "./ideas/ToolSwitcher";
import { PerspectiveCamera } from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import Lights from "./ideas/Lights";
import { ToolbeltContext, useToolbeltState } from "./logic/toolbelt";
import WorldLights from "./ideas/WorldLights";
export * from "./logic/toolbelt";

export type ToolbeltProps = {
  showOnSpawn?: boolean;
  worldLights?: boolean;
  localLights?: boolean;
};

type ToolbeltLayer = { children: ReactNode[] | ReactNode } & ToolbeltProps;

export function Toolbelt(props: ToolbeltLayer) {
  const {
    children,
    showOnSpawn = true,
    worldLights = true,
    localLights = true,
  } = props;

  const { camera } = useThree();
  const value = useToolbeltState(showOnSpawn);
  const { hudScene } = value;

  // hud render loop, use copied camera to render at 0,0,0
  const [camClone] = useState(() => (camera as PerspectiveCamera).clone());
  useFrame(({ gl }) => {
    const _cam = camera as PerspectiveCamera;
    camClone.position.set(0, 0, 0);
    camClone.quaternion.copy(_cam.quaternion);
    camClone.near = _cam.near;
    camClone.far = _cam.far;
    camClone.aspect = _cam.aspect;
    camClone.fov = _cam.fov;
    camClone.updateProjectionMatrix();

    // for all intents and purposes, the hud items are placed in real world coordinates
    // this is very important for raycasting
    hudScene.position.set(0, 0, 0);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(hudScene, camClone);
    hudScene.position.copy(camera.position);
    hudScene.updateMatrixWorld(true);
  }, 100);

  return (
    <ToolbeltContext.Provider value={value}>
      <ToolSwitcher />
      {localLights && createPortal(<Lights />, hudScene)}
      {worldLights && <WorldLights />}
      {children}
    </ToolbeltContext.Provider>
  );
}
