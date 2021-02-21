import { Assets, AssetType, AssetUrls } from "../types";

/**
 * Calculates loading percentage as a fraction of
 * the number of assets loaded over the total
 *
 * @param assets
 */
export const getPercentage = (assets: Assets): number => {
  const urls = Object.keys(assets);
  const total = urls.length;

  let numLoaded = 0;
  for (let i = 0; i < urls.length; i++) {
    numLoaded += Number(assets[urls[i]].loaded);
  }

  return numLoaded / total;
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
