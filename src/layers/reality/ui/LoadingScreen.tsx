import styled from "@emotion/styled";
import { useControlledProgress } from "../utils/loading";
const LoadingVideo =
  "https://d27rt3a60hh1lx.cloudfront.net/videos/mortloading.mp4";

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
const VideoStyle = {
  display: "block",
  margin: "0 auto",
};
export default function LoadingScreen() {
  const progress = useControlledProgress();

  return (
    <Container finished={progress === 101}>
      {Math.round(progress)}%
      <video
        style={VideoStyle}
        autoPlay={true}
        muted={true}
        loop={true}
        src={LoadingVideo}
      />
    </Container>
  );
}
