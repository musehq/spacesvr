import { MenuItem, useEnvironment } from "../logic/environment";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { isStandaloneVR } from "../../../logic/browser";

/**
 * Component to register menu items to the environment.
 * Needs to be a component because it needs access to the three context to run
 * but ideas outside of the three context need to access it, so it uses
 * the environment as a mediator
 */
export function RegisterMenuItems() {
  const { setMenuItems } = useEnvironment();
  const vrMenu = useVRMenuItem();
  const fsMenu = useFsMenuItem();
  const oqMenu = useOculusMenuItem();

  useEffect(() => {
    const arr: MenuItem[] = [];

    if (vrMenu) arr.push(vrMenu);
    if (fsMenu) arr.push(fsMenu);
    if (oqMenu) arr.push(oqMenu);

    setMenuItems(arr);
  }, [vrMenu?.text, fsMenu?.text, oqMenu?.text, setMenuItems]);

  return null;
}

export const useVRMenuItem = (): MenuItem | undefined => {
  const gl = useThree((state) => state.gl);
  const { setDevice, setPaused } = useEnvironment();

  const session = useRef<XRSession>();
  const [text, setText] = useState("Enter VR");

  const action = useCallback(() => {
    async function onSessionStarted(sesh: XRSession) {
      sesh.addEventListener("end", onSessionEnded);
      await gl.xr.setSession(sesh);
      setText("Exit VR");
      setDevice("xr");
      setPaused(false);
      session.current = sesh;
    }

    function onSessionEnded() {
      session.current?.removeEventListener("end", onSessionEnded);
      setDevice(isMobile ? "mobile" : "desktop");
      setText("Enter VR");
      setPaused(true);
      session.current = undefined;
    }

    if (session.current === undefined) {
      const sessionInit = {
        optionalFeatures: [
          "local-floor",
          "bounded-floor",
          "hand-tracking",
          "layers",
        ],
      };
      // @ts-ignore
      const xr = navigator.xr;
      xr!.requestSession("immersive-vr", sessionInit).then(onSessionStarted);
    } else {
      session.current?.end();
    }
  }, [gl.xr, setDevice, setPaused]);

  if (!isStandaloneVR()) {
    return undefined;
  }

  return {
    text,
    action,
  };
};

export const useOculusMenuItem = (): MenuItem | undefined => {
  if (isStandaloneVR()) return;

  return {
    text: "Open in Meta Quest",
    link: "https://www.oculus.com/open_url/?url=" + window.location.href,
  };
};

export const useFsMenuItem = (): MenuItem | undefined => {
  const domElement = document.body;

  const rfs =
    domElement.requestFullscreen ||
    // @ts-ignore
    domElement.webkitRequestFullScreen ||
    // @ts-ignore
    domElement.mozRequestFullScreen ||
    // @ts-ignore
    domElement.msRequestFullscreen ||
    undefined;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenAvailable] = useState(rfs !== undefined);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(document.fullscreenElement !== null);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const action = useCallback(() => {
    if (!rfs) return;
    if (!document.fullscreenElement) {
      rfs.apply(domElement, [{ navigationUI: "hide" }]);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [domElement, rfs]);

  if (!fullscreenAvailable || isStandaloneVR()) {
    return undefined;
  }

  return {
    text: `${isFullscreen ? "Exit" : "Enter"} Fullscreen`,
    action,
  };
};
