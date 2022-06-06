import { Global, css } from "@emotion/react";
import { useEffect } from "react";

const globalStyles = css`
  @font-face {
    font-family: "Quicksand";
    src: url("https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf");
  }

  html {
    position: fixed;
    height: 100%;
    overflow: hidden;
  }

  body {
    margin: 0;
    width: 100vw;
    height: 100vh;
    user-select: none;
    overflow-y: auto;
    overflow-x: hidden;
    touch-action: pan-x pan-y;
    -webkit-overflow-scrolling: touch;
    font-family: "Quicksand", sans-serif;
    font-size: 27px;
    @media screen and (max-width: 500px) {
      font-size: 24px;
    }
  }
`;

export default function GlobalStyles() {
  useEffect(() => {
    const view = document.createElement("meta");
    view.name = "viewport";
    view.content = "initial-scale=1, viewport-fit=cover";
    document.head.append(view);
    return () => {
      document.head.removeChild(view);
    };
  }, []);

  return (
    <>
      <Global styles={globalStyles} />
    </>
  );
}
