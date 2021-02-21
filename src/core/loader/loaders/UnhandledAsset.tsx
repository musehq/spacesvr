import { useContext, useEffect } from "react";
import { LoadingContext } from "../../contexts";

type Props = {
  url: string;
};

const UnhandledAsset = (props: Props) => {
  const { url } = props;
  const { assets } = useContext(LoadingContext);

  useEffect(() => {
    assets[url].loaded = true;
    console.error("spacesvr :: unhandled file type for asset with url", url);
  }, []);

  return null;
};

export default UnhandledAsset;
