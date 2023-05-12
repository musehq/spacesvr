import { BufferGeometry, Loader } from "three";
import { generateSimplifiedGeo } from "./simplify";

class GenerateSimplifiedGeoLoader extends Loader {
  constructor() {
    super();
  }

  load(geo: BufferGeometry, triTarget: number) {
    this.manager.itemStart;
    const calculation = generateSimplifiedGeo(geo, triTarget);
    this.manager.itemEnd;

    return calculation;
  }
}

export { GenerateSimplifiedGeoLoader };
