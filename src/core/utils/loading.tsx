import { Assets, AssetType, AssetUrls } from "../types";
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

/**
 * Calculates loading percentage as a fraction of
 * the number of assets loaded over the total
 *
 * @param assets
 */
export const getProgress = (assets: Assets): number => {
  const urls = Object.keys(assets);
  const total = urls.length;

  let numLoaded = 0;
  for (let i = 0; i < urls.length; i++) {
    numLoaded += Number(assets[urls[i]].loaded);
  }

  return (numLoaded / total) * 100;
};

/**
 * Transforms input assets (arr of strings) into an
 * Assets object
 *
 * @param assetList
 */
export const transformAssetList = (assetList?: AssetUrls): Assets => {
  if (assetList === undefined) {
    return {};
  }

  const assets: Assets = {};

  for (const url of assetList) {
    assets[url] = {
      url,
      loaded: false,
      type: getAssetType(url),
      error: false,
      data: undefined,
    };
  }

  return assets;
};

/**
 * Gets the asset type based on the url
 *
 * @param url
 */
export const getAssetType = (url: string): AssetType => {
  if (url.endsWith(".glb") || url.endsWith(".gltf")) {
    return "model";
  }

  if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith("jpeg")) {
    return "image";
  }

  if (url.endsWith(".hdr")) {
    return "env";
  }

  return null;
};

/**
 * A modified version of the controlled progress hooks that adds
 * - a minimum wait time, in case it takes a second to register an asset
 * - a delay after it reaches 100 in case it goes back down
 * - a timeout when it reaches > 50%, marked as stuck
 */
export const useLegacyProgress = () => {
  const TIMEOUT = 750; // minimum time to wait before moving to 100
  const AFTER_TIME = 100; // extra time to prevent bouncing at reaching 100
  const STUCK_TIMEOUT = 5500; // for safari, when stuck at a value above 50

  const { progress, total } = useProgress();

  const startTime = useRef(new Date());
  const controlledProgress = useRef(0);
  const finished = useRef(false);
  const [, setForceRender] = useState(0);

  useEffect(() => {
    const newTime = new Date();
    const timeElapsed = newTime.getTime() - startTime.current.getTime();
    const diff = Math.min(
      progress - controlledProgress.current,
      timeElapsed < TIMEOUT ? 99 : 100
    );
    if (diff > 0) {
      if (progress === 100) {
        finished.current = true;
        // if progress 100, check in AFTER_TIME ms to make sure it hasn't
        // bounced back down
        setTimeout(() => {
          if (finished.current) {
            controlledProgress.current = progress;
            // set state to force re render
            setForceRender(Math.random());
          }
        }, AFTER_TIME);
      } else {
        finished.current = false;
        controlledProgress.current = progress;

        // once above 50, skip progress is stuck then skip loading
        if (progress > 50) {
          setTimeout(() => {
            if (controlledProgress.current === progress) {
              setSkip(true);
            }
          }, STUCK_TIMEOUT);
        }
      }
    }
  }, [progress]);

  // wait TIMEOUT (ms) to check if any objects are waiting to be loaded
  const [counter, setCounter] = useState(0);
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    if (total > 0) {
      return;
    } else if (counter > 0) {
      setSkip(true);
    } else {
      setTimeout(() => setCounter(counter + 1), TIMEOUT);
    }
  }, [counter]);

  return skip ? 100 : Math.floor(controlledProgress.current);
};
