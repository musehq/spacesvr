import styled from "@emotion/styled";

export const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  canvas {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    outline: 0;
  }
`;
