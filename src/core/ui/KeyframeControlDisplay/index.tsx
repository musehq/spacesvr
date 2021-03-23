import styled from "@emotion/styled";
import { useKeyframeEnvironment } from "../../contexts/environment";
import { useCallback, useEffect } from "react";
import Arrow from "./components/Arrow";

const NavButton = styled.button`
  padding: 10px 20px;
  border: none;
  background: none;
  position: absolute;
  top: 75%;
  transform: translateY(-50%);
  cursor: pointer;
  outline: none;
  transition: transform 0.15s ease;
  mix-blend-mode: difference;

  &:hover {
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.925);
  }

  @media screen and (max-width: 750px) {
    top: calc(100% - 3rem);
  }
`;

const LeftNavButton = styled(NavButton)`
  left: 0;
`;

const RightNavButton = styled(NavButton)`
  right: 0;
`;

/**
 * Sets up Keyframe controls to click to move between keyframes or
 * press A/D/Arrow Keys to move between keyframes
 *
 * To be used with a keyframe environment
 *
 * @constructor
 */
export const KeyframeControlDisplay = () => {
  const { keyframes } = useKeyframeEnvironment();
  const { frames, setCurrent, currentIndex } = keyframes;

  const handleKeyboardInput = useCallback(
    (e: KeyboardEvent) => {
      const code = e.key.toLowerCase();
      if (code === "arrowleft" || code === "a") {
        setCurrent((currentIndex - 1 + frames.length) % frames.length);
      } else if (code === "arrowright" || code === "d") {
        setCurrent((currentIndex + 1 + frames.length) % frames.length);
      }
    },
    [currentIndex, frames]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardInput);

    return () => {
      document.removeEventListener("keydown", handleKeyboardInput);
    };
  }, [handleKeyboardInput]);

  return (
    <>
      <LeftNavButton
        onClick={() =>
          setCurrent((currentIndex - 1 + frames.length) % frames.length)
        }
      >
        <Arrow dir={"left"} />
      </LeftNavButton>
      <RightNavButton
        onClick={() => setCurrent((currentIndex + 1) % frames.length)}
      >
        <Arrow dir={"right"} />
      </RightNavButton>
    </>
  );
};
