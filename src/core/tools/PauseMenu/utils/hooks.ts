import { useEffect, useState } from "react";
import { useThree } from "react-three-fiber";

export type MenuItem = {
  text: string;
  action: () => void;
};

type MenuFunctionality = {
  menuItems: MenuItem[];
};

export const useMenuFunctionality = (): MenuFunctionality => {
  const fullscreenMenuItem = useFullscreenMenuItem();

  const menuItems: MenuItem[] = [
    { text: "Tutorial", action: () => console.log("mute audio") },
    { text: "Enter VR", action: () => console.log("try to enter vr") },
  ];

  if (fullscreenMenuItem !== undefined) menuItems.push(fullscreenMenuItem);

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
