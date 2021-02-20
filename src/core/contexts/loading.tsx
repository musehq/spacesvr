import { createContext, useEffect, useState } from "react";
import { AssetUrls, LoadingState } from "../types";
import { proxy, subscribe } from "valtio";
import { getPercentage, transformAssetList } from "../utils/loading";

export const LoadingContext = createContext<LoadingState>({} as LoadingState);

/**
 * Loading State Context. If no asset strings are passed, the app
 * will default to the legacy loader which is the useProgress hook
 *
 * @param assetList
 */
export const useLoadingState = (assetList?: AssetUrls) => {
  const legacyLoader = assetList === undefined;

  const assets = proxy(transformAssetList(assetList));
  const [percentage, setPercentage] = useState(legacyLoader ? 1 : 0);

  // subscribe to updates to keep percentage value up to date
  useEffect(() => {
    if (!legacyLoader) {
      const unsubscribe = subscribe(assets, () =>
        setPercentage(getPercentage(assets))
      );

      return () => {
        unsubscribe();
      };
    }
  }, [legacyLoader, assets]);

  return { legacyLoader, assets, percentage };
};
