import * as THREE from "three";
import { useRef, useEffect } from "react";
import { extend, useFrame, useThree } from "react-three-fiber";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

extend({ PointerLockControls });

type MouseFPSCameraProps = {
  onUnlock: () => void;
};

/**
 * MouseFPSCamera controls the camera rotation, set up as a first
 * person view. It takes care of user input to set the camera rotation
 * and passed the quaternion of the camera up. Its position is attached
 * to the passed position, probably the player's position.
 *
 * @param props
 * @constructor
 */
const MouseFPSCamera = (props: MouseFPSCameraProps) => {
  const { onUnlock } = props;

  const { camera, gl } = useThree();

  const controls = useRef<PointerLockControls>();

  useFrame(() => {
    if (controls?.current?.isLocked === true) {
      const lookAt = new THREE.Vector3(0, 0, -1);
      lookAt.applyQuaternion(camera.quaternion);
      lookAt.multiply(new THREE.Vector3(1, 0, 1)).normalize();
    }
  });

  useEffect(() => {
    controls?.current?.lock();
    setTimeout(() => {
      if (!controls?.current?.isLocked) {
        onUnlock();
      }
    }, 250);
  }, []);

  useEffect(() => {
    controls?.current?.addEventListener("unlock", onUnlock);

    return () => {
      controls?.current?.removeEventListener("unlock", onUnlock);
    };
  }, [controls]);

  // @ts-ignore
  return <pointerLockControls ref={controls} args={[camera, gl.domElement]} />;
};

export default MouseFPSCamera;
