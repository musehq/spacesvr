import { Global, css } from "@emotion/react";

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

export default () => <Global styles={globalStyles} />;
