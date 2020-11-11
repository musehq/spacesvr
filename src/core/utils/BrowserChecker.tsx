import { ReactNode, useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";

const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

const IMAGE_SRC =
  "https://d27rt3a60hh1lx.cloudfront.net/images/spaces-logo.png";

const float = keyframes`
        0% {
            transform: translate(-50%, -50%) translateY(0px)
    }
    
        50% {
            transform: translate(-50%, -50%) translateY(-15px)
    }
    
        100% {
            transform: translate(-50%, -50%) translateY(0px)
    }
`;

const Image = styled.div`
  position: absolute;
  width: 90%;
  height: 90%;
  max-width: 500px;
  max-height: 500px;
  background-image: url(${IMAGE_SRC});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.4;
  animation: ${float} 7s ease-in-out infinite;
`;

type BrowserCheckerProps = {
  children: ReactNode;
};

const INVALID_KEYWORDS = ["FBAN", "FBAV", "Instagram"];

const BrowserChecker = (props: BrowserCheckerProps) => {
  const { children } = props;

  const [valid, setValid] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";
    const valid = INVALID_KEYWORDS.filter((val) => ua.includes(val));
    setValid(valid.length === 0);
  }, []);

  if (valid) {
    return <>{children}</>;
  }

  return (
    <Container>
      <Image />
      This browser cannot run our application.
      <br />
      <br />
      Click those three dots at the top right
      <br />
      to open in Safari or Chrome.
    </Container>
  );
};

export default BrowserChecker;
