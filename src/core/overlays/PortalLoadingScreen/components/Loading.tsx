import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import SpinningLoading from "./SpinningLoading";

const Container = styled.div<{ finished: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 201;
  background: white;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Lato", sans-serif;
  perspective: 500px;

  transition: opacity 1.5s ease;
  transition-delay: 2.25s;
  ${(props) => props.finished && "opacity: 0;"}
  ${(props) => props.finished && "pointer-events: none;"}
`;

const flickering = keyframes`
  0%, 100% {
    transform: rotate(-0.35deg) translateZ(66px);
     opacity: 0.9;
  }
  25%, 75% {
    transform: rotate(0.2deg) translateZ(-10px);
     opacity: 0.3;
  }
  50% {
    transform: rotate(0.5deg) translateZ(46px);
    opacity: 0.69;
  }
`;

const TextContainer = styled.div<{ finished: boolean }>`
  transition: opacity 1s ease-out;
  transition-delay: 1.25s;
  ${(props) => props.finished && "opacity: 0;"}
`;

const Text = styled.p`
  animation: ${flickering} 6s linear infinite;
`;

const Loading = (props: { progress: number }) => {
  const { progress } = props;

  return (
    <Container finished={progress === 100}>
      <TextContainer finished={progress === 1}>
        <Text>{Math.floor(progress)}</Text>
      </TextContainer>
      <SpinningLoading progress={progress} />
    </Container>
  );
};

export default Loading;
