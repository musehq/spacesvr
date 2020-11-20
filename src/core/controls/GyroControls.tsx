import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";
import { MutableRefObject, ReactNode, useEffect, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Quaternion, Vector3 } from "three";

type GyroControlsProps = {
  quaternion: MutableRefObject<Quaternion>;
  position: MutableRefObject<Vector3>;
  fallback: ReactNode;
};

export const GyroControls = (props: GyroControlsProps) => {
  const { quaternion, position, fallback } = props;

  const { camera } = useThree();

  const [controls, setControls] = useState<DeviceOrientationControls>();
  const [enableGyro, setEnableGyro] = useState(false);

  useEffect(() => {
    if (!controls) {
      const func = () => {
        const cont = new DeviceOrientationControls(camera);
        cont.enabled = false;
        setControls(cont);
      };
      window.addEventListener("click", func);

      return () => {
        window.removeEventListener("click", func);
      };
    }
  }, [controls]);

  useFrame(() => {
    if (controls && !enableGyro) {
      if (Object.keys(controls.deviceOrientation).length !== 0) {
        setEnableGyro(true);
        controls.enabled = true;
      }
    }

    if (controls) {
      controls.update();
      quaternion.current = camera.quaternion;
    }

    if (position.current) {
      const { x: pX, y: pY, z: pZ } = position.current;
      camera?.position?.set(pX, pY, pZ);
    }
  });

  if (!enableGyro) {
    return <>{fallback}</>;
  }

  return null;
};
