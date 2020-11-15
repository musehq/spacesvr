import styled from "@emotion/styled";
import { useTrackEnvironment } from "../utils/hooks";
import { useCallback, useEffect } from "react";

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9;
  display: flex;
  justify-items: flex-end;
  align-items: flex-end;
  padding: 25px;
`;

const NavButton = styled.button`
  background: white;
  padding: 10px 20px;
  font-size: 3rem;
  border: 2px solid black;
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
    <Container>
      <NavButton
        onClick={() =>
          setCurrent((currentIndex - 1 + frames.length) % frames.length)
        }
      >
        &lt;
      </NavButton>
      <NavButton onClick={() => setCurrent((currentIndex + 1) % frames.length)}>
        &gt;
      </NavButton>
    </Container>
  );
};
