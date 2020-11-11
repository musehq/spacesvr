import { Dispatch, SetStateAction, useState } from "react";
import Transition from "./components/Transition";
import Loading from "./components/Loading";
import { useControlledProgress, useEnvironment } from "../../index";

type LoadingScreenProps = {
  setFixedPath: Dispatch<SetStateAction<boolean>>;
};

const PortalLoadingScreen = (props: LoadingScreenProps) => {
  const { setFixedPath } = props;

  const { setPaused } = useEnvironment();

  const [start, setStart] = useState(false);

  const beginExperience = () => {
    setPaused(false);
    setStart(true);
  };

  const selfExplore = () => {
    setFixedPath(false);
    beginExperience();
  };

  const progress = useControlledProgress();

  return (
    <>
      <Loading progress={progress} />
      <Transition
        start={start}
        beginExperience={beginExperience}
        selfExplore={selfExplore}
      />
    </>
  );
};

export default PortalLoadingScreen;
