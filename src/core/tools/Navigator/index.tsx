import { useEffect, useState } from "react";
import { Idea } from "../../../components/Idea";
import { Floating } from "../../../modifiers/Floating";
import { Tool } from "../../../modifiers/Tool";
import Menu from "./panels/Menu";
// @ts-ignore
import { animated, useSpring } from "react-spring/three";
import { config } from "react-spring";
import Welcome from "./panels/Welcome";
import Tutorial from "./panels/Tutorial";
import { hasOnboarded } from "./utils/onboard";
import { MenuStage, NavigatorContext } from "./utils/context";
import { useEnvironment } from "../../contexts/environment";

const Navigator = () => {
  const { pointerLocked } = useEnvironment();

  const [open, setOpen] = useState(true);
  const [stage, setStage] = useState<MenuStage>(
    hasOnboarded() ? "menu" : "welcome"
  );

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "t") {
      setOpen(!open);
    }
  };

  useEffect(() => {
    if (pointerLocked && open) {
      setOpen(false);
    }

    window.addEventListener("keypress", onKeyPress);
    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [open, pointerLocked]);

  const { scale } = useSpring({
    scale: open ? 1 : 0,
    ...config.gentle,
  });

  const state = { stage, setStage, open };

  return (
    <Tool pos={[-1, open ? 0.8 : 4]} face>
      <Floating height={1}>
        <animated.group scale-x={scale} scale-y={scale} scale-z={scale}>
          <NavigatorContext.Provider value={state}>
            <Idea size={2} />
            {stage === "welcome" && <Welcome position-x={2} />}
            {stage === "menu" && <Menu position-x={2} />}
            {stage === "tutorial" && <Tutorial position-x={2} />}
          </NavigatorContext.Provider>
        </animated.group>
      </Floating>
    </Tool>
  );
};

export default Navigator;
