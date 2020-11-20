import styled from "@emotion/styled";
import { useTrackEnvironment } from "../../utils/hooks";
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

export const TrackControlDisplay = () => {
  const {
    keyframes: { frames, setCurrent, currentIndex },
  } = useTrackEnvironment();

  const handleKeyboardInput = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": {
          setCurrent((currentIndex - 1 + frames.length) % frames.length);
          break;
        }
        case "ArrowRight": {
          setCurrent((currentIndex + 1 + frames.length) % frames.length);
          break;
        }
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
