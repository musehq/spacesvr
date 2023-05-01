import styled from "@emotion/styled";

export const Container = styled.div<{ paused: boolean; dev?: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transition: opacity 0.25s ease;
  background: rgba(0, 0, 0, ${(props) => (props.dev ? 0 : 0.25)});
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  opacity: ${(props) => (props.paused ? 1 : 0)};
  pointer-events: ${(props) => (props.paused ? "all" : "none")};
  font-family: "Quicksand", sans-serif;
  font-size: 27px;
  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;

export const ClickContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

export const Window = styled.div`
  width: 90%;
  max-width: 400px;
  padding: 20px 20px;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 10px;
  background-color: white;
  background-position: center;
  background-size: cover;
  box-sizing: border-box;

  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
`;

export const Continue = styled.div<{ color: string }>`
  width: 90%;
  max-width: 400px;
  height: auto;
  cursor: pointer;
  text-align: center;
  font-size: 1.3em;
  font-family: "Quicksand", sans-serif;
  transition: opacity 0.15s linear;
  margin-top: 20px;
  background: ${(props) => props.color};
  color: white;
  //border: 2px solid black;
  line-height: 1em;
  padding: 12px 0;
  border-radius: 10px;
  :hover {
    opacity: 0.5;
  }

  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
`;

export const Instructions = styled.div`
  width: 100%;
  height: auto;
  margin: 30px 0;
  font-size: 0.7em;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  & > p {
    margin: 0.2em;
  }
`;

export const MenuButton = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  padding: 5px 10px;
  margin: 8px 4px;
  transition: background 0.15s linear;
  font-size: 0.5em;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export const MenuLink = styled.a`
  border: 1px solid black;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  padding: 5px 10px;
  margin: 8px 4px;
  transition: background 0.15s linear;
  font-size: 0.5em;
  cursor: pointer;
  text-decoration: none;
  color: black !important;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export const Title = styled.h1`
  margin: 0;
`;

export const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;
