import { BufferGeometry, Loader, DefaultLoadingManager } from "three";
import { SimplifyModifier } from "../lib/SimplifyModifier";

export const generateSimplifiedGeo = (
  geo: BufferGeometry,
  triTarget: number
) => {
  const modifier = new SimplifyModifier();

  class SimplifyGeoLoader extends Loader {
    constructor() {
      super(DefaultLoadingManager);
    }

    load(geo: BufferGeometry, triTarget: number) {
      const result = modifier.modify(geo, Math.floor(triTarget));

      return result;
    }
  }

  const simplifyGeoLoader = new SimplifyGeoLoader();
  return simplifyGeoLoader.load(geo, triTarget);
};
