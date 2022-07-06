import styled from "@emotion/styled";
import { isMobile } from "react-device-detect";

const Element = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1;
  mix-blend-mode: difference;

  &::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 1.5px;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    background: #ffffff;
  }

  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 1.5px;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    background: #ffffff;
  }
`;

const Crosshair = () => {
  if (isMobile) {
    return null;
  }

  return <Element />;
};

export default Crosshair;
