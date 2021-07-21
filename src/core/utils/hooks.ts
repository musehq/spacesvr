import { useEffect, useState } from "react";

/**
 * Check validity of browser to run 3d experiences,
 * Automatically blacklists Facebook & Instagram in-app
 * browsers
 *
 * @param keywords
 */
export const useValidBrowser = (keywords?: string[]): boolean => {
  const [valid, setValid] = useState(true);

  const INVALID_KEYWORDS = ["FBAN", "FBAV", "Instagram"].concat(keywords || []);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";
    const valid = INVALID_KEYWORDS.filter((val) => ua.includes(val));
    setValid(valid.length === 0);
  }, []);

  return valid;
};

interface Keyboard {
  getLayoutMap: () => any;
}

interface KeyboardLayoutMap {
  get: (key: string) => any;
}

interface Navigator {
  keyboard: Keyboard;
}

/**
 * Check validity of browser to run 3d experiences,
 * Automatically blacklists Facebook & Instagram in-app
 * browsers
 */
export const useKeyboardLayout = (): string => {
  const [layout, setLayout] = useState("W/A/S/D");

  useEffect(() => {
    // @ts-ignore
    if (navigator.keyboard) {
      // @ts-ignore
      const keyboard = navigator.keyboard;
      keyboard.getLayoutMap().then((keyboardLayoutMap: KeyboardLayoutMap) => {
        const upKey = keyboardLayoutMap.get("KeyW");
        if (upKey === "z") setLayout("Z/Q/S/D");
      });
    }
  }, []);

  return layout;
};
