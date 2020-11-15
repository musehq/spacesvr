import { isMobile } from "react-device-detect";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";

export const GyroControls = () => {
  const { camera } = useThree();

  const controls = useRef<DeviceOrientationControls>();

  useEffect(() => {
    if (isMobile) {
      window.addEventListener("click", () => {
        controls.current = new DeviceOrientationControls(camera);
      });
    }
  }, []);

  useFrame(() => {
    if (isMobile && controls.current) {
      controls.current.update();
    }
  });

  return null;
};
