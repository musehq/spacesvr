import { SpringValue } from "@react-spring/three";
import { useState } from "react";
import { useLimitedFrame } from "./limiter";

/**
 * Given a spring animated value, return a visible value when the springed value reaches 0.
 * Used for setting the visible prop to false when a component is scaled to 0
 * @param val
 */

export const useVisible = (val: SpringValue<number>) => {
  const [visible, setVisible] = useState(false);

  useLimitedFrame(5, () => {
    const v = val.get();
    if (visible && v === 0) setVisible(false);
    else if (!visible && v > 0) setVisible(true);
  });

  return visible;
};
