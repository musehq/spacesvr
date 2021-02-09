import styled from "@emotion/styled";
import { isMobile } from "react-device-detect";

const Element = styled.div`
  position: fixed;
  top: 50vh;
  left: 50vw;
  z-index: 1;
  mix-blend-mode: difference;

  &::before {
    content: "";
    display: block;
    height: 11px;
    border-left: 1px solid #fff;
    margin-bottom: -6px;
  }

  &::after {
    content: "";
    display: block;
    width: 11px;
    border-top: 1px solid #fff;
    margin-left: -5px;
  }
`;

const Crosshair = () => {
  if (isMobile) {
    return null;
  }

  return <Element />;
};

export default Crosshair;
