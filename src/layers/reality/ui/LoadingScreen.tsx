import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useControlledProgress } from "../utils/loading";

const float = keyframes`
  0% {
    transform: translatey(0px);
  }

  50% {
    transform: translatey(-15px);
  }

  100% {
    transform: translatey(0px);
  }
`;

const Container = styled.div<{ finished: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  background: white;
  transition: opacity 0.75s ease-in;
  transition-delay: 0.5s;
  opacity: ${(props) => (props.finished ? "0" : "1")};
  pointer-events: ${(props) => (props.finished ? "none" : "all")};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Text = styled.div`
  animation: ${float} 7s ease-in-out infinite;
`;

export default function LoadingScreen() {
  const progress = useControlledProgress();

  return (
    <Container finished={progress === 100}>
      <Text>{Math.round(progress)}%</Text>
    </Container>
  );
}
