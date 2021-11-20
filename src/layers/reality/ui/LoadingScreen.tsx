import styled from "@emotion/styled";
import { useControlledProgress } from "../utils/loading";
const loadingGifURL =
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
  background-image: url(${loadingGifURL});
  background-repeat: no-repeat;
  background-position: center;
  flex-direction: column;
`;

export default function LoadingScreen() {
  const progress = useControlledProgress();

  return (
    <Container finished={progress === 100}>
      {Math.round(progress)}%
      <video autoPlay={true} muted={true} loop={true} src={loadingGifURL} />
    </Container>
  );
}
