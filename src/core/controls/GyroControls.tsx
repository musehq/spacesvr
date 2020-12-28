import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";
import { ReactNode, useEffect, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";

type GyroControlsProps = {
  fallback: ReactNode;
};

/**
 *
 * Gyro controls uses device orientation controls from three js, if applicable.
 * A required fallback component will be used in the place of the gyroscope
 * controls until they are accepted and in use.
 *
 * @param props
 * @constructor
 */
export const GyroControls = (props: GyroControlsProps) => {
  const { fallback } = props;

  const { camera } = useThree();

  const [controls, setControls] = useState<DeviceOrientationControls>();
  const [enableGyro, setEnableGyro] = useState(false);

  // try to prompt user for device controls
  useEffect(() => {
    if (!controls) {
      const func = () => {
        const cont = new DeviceOrientationControls(camera);
        cont.enabled = false; // set to disabled in case they're not working yet
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
      // check if an event has been received yet
      if (Object.keys(controls.deviceOrientation).length !== 0) {
        setEnableGyro(true);
        controls.enabled = true;
      }
    }

    if (controls) {
      controls.update();
    }
  });

  if (!enableGyro) {
    return <>{fallback}</>;
  }

  return null;
};
