import { DoubleSide, MeshBasicMaterial, MeshStandardMaterial } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";

const universe_cache = new Map();

function getResource<T = any>(key: string, constructor: () => T) {
  let resource = universe_cache.get(key);
  if (!resource) {
    resource = constructor();
    universe_cache.set(key, resource);
  }
  return resource;
}

export const universe = {
  get mat_standard_white(): MeshStandardMaterial {
    return getResource<MeshStandardMaterial>(
      "mat_standard_white",
      () => new MeshStandardMaterial({ color: "white" })
    );
  },
  get mat_standard_cream_double(): MeshStandardMaterial {
    return getResource<MeshStandardMaterial>(
      "mat_standard_cream_double",
      () => new MeshStandardMaterial({ color: "#aaa", side: DoubleSide })
    );
  },
  get mat_standard_black(): MeshStandardMaterial {
    return getResource<MeshStandardMaterial>(
      "mat_standard_black",
      () => new MeshStandardMaterial({ color: "black" })
    );
  },
  get mat_standard_rose(): MeshStandardMaterial {
    return getResource<MeshStandardMaterial>(
      "mat_standard_rose",
      () => new MeshStandardMaterial({ color: "#ff007f" })
    );
  },
  get mat_basic_black(): MeshBasicMaterial {
    return getResource<MeshBasicMaterial>(
      "mat_basic_black",
      () => new MeshBasicMaterial({ color: "black" })
    );
  },
  get mat_basic_gray(): MeshBasicMaterial {
    return getResource<MeshBasicMaterial>(
      "mat_basic_gray",
      () => new MeshBasicMaterial({ color: "#828282" })
    );
  },
  get mat_basic_red(): MeshBasicMaterial {
    return getResource<MeshBasicMaterial>(
      "mat_basic_red",
      () => new MeshBasicMaterial({ color: "red" })
    );
  },
  get mat_basic_black_wireframe(): MeshBasicMaterial {
    return getResource<MeshBasicMaterial>(
      "mat_basic_black_wireframe",
      () => new MeshBasicMaterial({ color: "black", wireframe: true })
    );
  },
  get geo_rounded_box_1x1(): RoundedBoxGeometry {
    return getResource<RoundedBoxGeometry>(
      "geo_rounded_box_1x1",
      () => new RoundedBoxGeometry(1, 1, 0.25, 4, 0.125)
    );
  },
  get geo_rounded_box_1x0_35(): RoundedBoxGeometry {
    return getResource<RoundedBoxGeometry>(
      "geo_rounded_box_1x0_35",
      () => new RoundedBoxGeometry(1, 0.35, 0.125, 4, 0.0625)
    );
  },
  get geo_rounded_box_1x0_3(): RoundedBoxGeometry {
    return getResource<RoundedBoxGeometry>(
      "geo_rounded_box_1x0_3",
      () => new RoundedBoxGeometry(1, 0.3, 0.1, 4, 0.05)
    );
  },
};
