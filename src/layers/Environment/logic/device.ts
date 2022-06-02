import { useState } from "react";
import { isMobile } from "react-device-detect";

export type Device = "desktop" | "mobile" | "xr";
export type DeviceState = {
  xr: boolean;
  mobile: boolean;
  desktop: boolean;
};

export const useDevice = () => {
  const [device, setDevice] = useState<Device>(isMobile ? "mobile" : "desktop");

  return {
    device: {
      mobile: device === "mobile",
      desktop: device === "desktop",
      xr: device === "xr",
    },
    setDevice,
  };
};
