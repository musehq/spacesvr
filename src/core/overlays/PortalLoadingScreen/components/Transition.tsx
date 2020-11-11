import styled from "@emotion/styled/";

const Container = styled.div<{ finished: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Lato", sans-serif;

  transition: opacity 0.7s ease;
  ${(props) => props.finished && "opacity: 0;"}
  ${(props) => props.finished && "pointer-events: none;"}
`;

const Begin = styled.button`
  color: white;
  font-size: 4rem;
  font-weight: bold;
  outline: none;
  height: auto;
  width: auto;
  padding: 20px 20px 20px 20px;
  transition: opacity 1s ease;
  transition-delay: 0.5s;
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
  border: none;
  font-family: "Lato", sans-serif;

  @media screen and (max-width: 650px) {
    font-size: 2rem;
  }
`;

const BeginBackground = styled.div`
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  background-image: linear-gradient(120deg, magenta, #5b328d);
  background-size: 120% 120%;
  background-position: top left;
  border-radius: 5px;
  transition: opacity 1s ease, background-position 0.3s linear;
  margin-bottom: 20px;

  &:hover,
  &:active {
    background-position: bottom right;
  }
`;

const AlternateStart = styled.div`
  position: fixed;
  bottom: 5vh;
  color: black;
  font-size: 1.5rem;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
  transition: opacity 1s ease;
  transition-delay: 2s;

  @media screen and (max-width: 650px) {
    font-size: 1rem;
  }
`;

type TransitionType = {
  start: boolean;
  beginExperience: any;
  selfExplore: any;
};

const Transition = (props: TransitionType) => {
  const { start, beginExperience, selfExplore } = props;

  return (
    <Container finished={start}>
      <BeginBackground>
        <Begin onClick={beginExperience}>Experience</Begin>
      </BeginBackground>
      <AlternateStart onClick={selfExplore}>
        Or, Explore on Your Own
      </AlternateStart>
    </Container>
  );
};

export default Transition;
