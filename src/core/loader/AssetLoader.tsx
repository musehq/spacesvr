import { Suspense, useContext } from "react";
import { LoadingContext } from "../contexts/loading";
import EnvAsset from "./loaders/EnvAsset";
import ImageAsset from "./loaders/ImageAsset";
import ModelAsset from "./loaders/ModelAsset";
import { useProxy } from "valtio";
import UnhandledAsset from "./loaders/UnhandledAsset";
import { getAssetType } from "../utils/loading";

const AssetLoader = () => {
  const { assets, progress } = useContext(LoadingContext);

  const snapshot = useProxy(assets);

  if (progress === 100) {
    return null;
  }

  const urls = Object.keys(snapshot);

  return (
    <Suspense fallback={null}>
      {urls.map((url) => {
        const type = getAssetType(url);

        // already loaded
        if (snapshot[url].loaded) return null;

        if (type === "env") return <EnvAsset key={url} url={url} />;
        if (type === "image") return <ImageAsset key={url} url={url} />;
        if (type === "model") return <ModelAsset key={url} url={url} />;
        else return <UnhandledAsset key={url} url={url} />;
      })}
    </Suspense>
  );
};

export default AssetLoader;
