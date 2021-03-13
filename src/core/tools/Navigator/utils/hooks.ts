import { useEffect, useRef, useState } from "react";
import { useThree } from "react-three-fiber";
import { XRSession } from "three";
import { useEnvironment } from "../../../contexts/environment";
import { setOnboarded } from "./onboard";
import { useNavigator } from "./context";

export type MenuItem = {
  text: string;
  action: () => void;
};

type MenuFunctionality = {
  menuItems: MenuItem[];
};

export const useMenuFunctionality = (): MenuFunctionality => {
  const { setStage } = useNavigator();
  const fullscreenMenuItem = useFullscreenMenuItem();
  const vrMenuItem = useVRMenuItem();

  const menuItems: MenuItem[] = [
    {
      text: "Tutorial",
      action: () => {
        setOnboarded(false);
        setStage("welcome");
      },
    },
  ];

  if (fullscreenMenuItem !== undefined) menuItems.push(fullscreenMenuItem);
  if (vrMenuItem !== undefined) menuItems.push(vrMenuItem);

  return {
    menuItems,
  };
};

const useFullscreenMenuItem = (): MenuItem | undefined => {
  const {
    gl: { domElement },
  } = useThree();

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

const useVRMenuItem = (): MenuItem | undefined => {
  const { gl } = useThree();
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
