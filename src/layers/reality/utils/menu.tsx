import { useEnvironment } from "../layers/environment";
import { useThree } from "@react-three/fiber";
import { XRSession } from "three";
import { useEffect, useRef, useState } from "react";
import { MenuItem } from "../types/environment";

/**
 * Component to register menu items to the environment.
 * Needs to be a component because it needs access to the three context to run
 * but ideas outside of the three context need to access it, so it uses
 * the environment as a mediator
 *
 * @constructor
 */
export function RegisterMenuItems() {
  const { setMenuItems } = useEnvironment();
  const vrMenu = useVRMenuItem();
  const fsMenu = useFsMenuItem();

  //TODO: too many re-renders

  useEffect(() => {
    const arr: MenuItem[] = [];

    if (vrMenu) arr.push(vrMenu);
    if (fsMenu) arr.push(fsMenu);

    setMenuItems(arr);
  }, [vrMenu?.text, fsMenu?.text]);

  return null;
}

export const useVRMenuItem = (): MenuItem | undefined => {
  const gl = useThree((state) => state.gl);
  const { setDevice } = useEnvironment();

  // @ts-ignore
  const xr = navigator.xr;

  const session = useRef<XRSession>();
  const [text, setText] = useState("Enter VR");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const isSupported = async () => {
      if (!("xr" in window.navigator)) {
        setSupported(false);
        return;
      }

      const support = await xr.isSessionSupported("immersive-vr");
      setSupported(support);
    };

    isSupported();
  }, []);

  if (!supported) {
    return undefined;
  }

  const action = () => {
    async function onSessionStarted(sesh: XRSession) {
      sesh.addEventListener("end", onSessionEnded);
      await gl.xr.setSession(sesh);
      setText("Exit VR");
      setDevice("xr");
      session.current = sesh;
    }

    function onSessionEnded() {
      session.current?.removeEventListener("end", onSessionEnded);
      setText("Enter VR");
      session.current = undefined;
    }

    if (session.current === undefined) {
      const sessionInit = {
        optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
      };
      xr.requestSession("immersive-vr", sessionInit).then(onSessionStarted);
    } else {
      session.current?.end();
    }
  };

  return {
    text,
    action,
  };
};

export const useFsMenuItem = (): MenuItem | undefined => {
  const domElement = document.body;

  const getRFS = () =>
    domElement.requestFullscreen ||
    // @ts-ignore
    domElement.webkitRequestFullScreen ||
    // @ts-ignore
    domElement.mozRequestFullScreen ||
    // @ts-ignore
    domElement.msRequestFullscreen ||
    undefined;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenAvailable] = useState(getRFS() !== undefined);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(document.fullscreenElement !== null);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (!fullscreenAvailable) {
    return undefined;
  }

  return {
    text: `${isFullscreen ? "Exit" : "Enter"} Fullscreen`,
    action: () => {
      if (!document.fullscreenElement) {
        const rfs = getRFS();
        rfs.apply(domElement, [{ navigationUI: "hide" }]);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },
  };
};
