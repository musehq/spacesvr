import { DoubleSide, MeshBasicMaterial, MeshStandardMaterial } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { useEffect, useState } from "react";

const universe_cache = new Map<string, any>();

function getResource<T = any>(
  key: string,
  constructor: () => T,
  opts?: { verbose?: boolean }
) {
  let resource = universe_cache.get(key);
  if (!resource) {
    if (opts?.verbose) console.log(`[CACHE] ${key} not found, creating new`);
    resource = constructor();
    universe_cache.set(key, resource);
  } else {
    if (opts?.verbose) console.log(`[CACHE] ${key} found, returning`);
  }
  return resource;
}

export const cache = {
  getResource,
  useResource: <T = any>(
    key: string,
    constructor: () => T,
    opts?: { verbose?: boolean }
  ) => {
    const [resource, setResource] = useState<T>(
      getResource(key, constructor, opts)
    );
    useEffect(() => {
      setResource(getResource(key, constructor, opts));
    }, [key]);
    return resource;
  },
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
  get mat_standard_red(): MeshStandardMaterial {
    return getResource<MeshStandardMaterial>(
      "mat_standard_red",
      () => new MeshStandardMaterial({ color: "#ff0000" })
    );
  },
  get mat_basic_white(): MeshBasicMaterial {
    return getResource<MeshBasicMaterial>(
      "mat_basic_white",
      () => new MeshBasicMaterial({ color: "white" })
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
};
