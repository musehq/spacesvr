import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useControlledProgress } from "./logic/loading";

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
const grow = keyframes`
  0% {
    opacity: 0.8;
  }

  50% {
    opacity: 0.2;
  }

  100% {
    opacity: 0.8;
  }
`;

const Container = styled.div<{ finished: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
  background: white;
  transition: opacity 0.75s ease-in;
  transition-delay: 0.5s;
  opacity: ${(props) => (props.finished ? "0" : "1")};
  pointer-events: ${(props) => (props.finished ? "none" : "all")};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Quicksand", sans-serif;
  font-size: 27px;
  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;

const Text = styled.div`
  animation: ${float} 7s ease-in-out infinite;
`;

const Wrapper = styled.div`
  position: relative;

  &:before {
    pointer-events: none;
    position: absolute;
    content: "";
    top: 100%;
    left: 5%;
    height: 10px;
    width: 90%;
    background: -webkit-radial-gradient(
      center,
      ellipse,
      rgba(0, 0, 0, 0.35) 0%,
      transparent 80%
    );
    background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.35) 0%,
      transparent 80%
    );
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: transform, opacity;
    transition-property: transform, opacity;
    animation: ${grow} 7s ease-in-out infinite;
  }
`;

export default function LoadingScreen() {
  const progress = useControlledProgress();

  return (
    <Container finished={progress === 100}>
      <Wrapper>
        <Text>{Math.round(progress)}%</Text>
      </Wrapper>
    </Container>
  );
}
