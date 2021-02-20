import { Suspense, useContext } from "react";
import { LoadingContext } from "../contexts/loading";
import EnvAsset from "./loaders/EnvAsset";
import { getAssetType } from "../utils/loading";
import ImageAsset from "./loaders/ImageAsset";
import ModelAsset from "./loaders/ModelAsset";
import { useProxy } from "valtio";

const AssetLoader = () => {
  const { assets, percentage } = useContext(LoadingContext);

  const snapshot = useProxy(assets);

  if (percentage === 1) {
    return null;
  }

  const urls = Object.keys(snapshot);

  return (
    <Suspense fallback={null}>
      {urls.map((url) => {
        const type = getAssetType(url);
        const props = { key: url, url, assets };

        // already loaded
        if (snapshot[url].loaded) return null;

        if (type === "env") return <EnvAsset {...props} />;
        if (type === "image") return <ImageAsset {...props} />;
        if (type === "model") return <ModelAsset {...props} />;

        // not a valid asset
        if (!snapshot[url].loaded) {
          assets[url].loaded = true;
        }

        return null;
      })}
    </Suspense>
  );
};

export default AssetLoader;
