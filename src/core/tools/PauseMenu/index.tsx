import { useEffect, useState } from "react";
import { Idea } from "../../../components/Idea";
import { Floating } from "../../../modifiers/Floating";
import Menu from "./components/Menu";
import { Tool } from "../../../modifiers/Tool";
// @ts-ignore
import { animated, useSpring } from "react-spring/three";
import { config } from "react-spring";
import Welcome from "./components/Welcome";
import { hasOnboarded, setOnboarded } from "./utils/onboard";

export type MenuState = "welcome" | "menu" | "tutorial";

const PauseMenu = () => {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState<MenuState>(
    hasOnboarded() ? "menu" : "welcome"
  );

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "t") {
      setOpen(!open);
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", onKeyPress);
    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [open]);

  const { scale } = useSpring({
    scale: open ? 1 : 0,
    ...config.gentle,
  });

  return (
    <Tool pos={[-1, open ? 0.8 : 4]} face>
      <Floating height={1}>
        <animated.group scale-x={scale} scale-y={scale} scale-z={scale}>
          <Idea size={2} />
          {state === "welcome" && (
            <Welcome position-x={2} setState={setState} />
          )}
          {state === "menu" && <Menu position-x={2} />}
        </animated.group>
      </Floating>
    </Tool>
  );
};

export default PauseMenu;
