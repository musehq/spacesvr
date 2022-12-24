import { cache } from "../../logic/cache";
import { NamedArrayTuple } from "@react-three/drei/helpers/ts-utils";
import { useMemo, useState } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { Vector3 } from "three";
import { GroupProps, MeshProps } from "@react-three/fiber";

type RoundedBox = {
  args?: NamedArrayTuple<
    (width?: number, height?: number, depth?: number) => void
  >;
} & Pick<MeshProps, "material"> &
  Omit<GroupProps, "args">;

type CachedBox = {
  key: string;
  width: number;
  height: number;
  depth: number;
};

const local_cache: CachedBox[] = [];

export function RoundedBox(props: RoundedBox) {
  const {
    args: [width = 1, height = 1, depth = 0.25] = [],
    material,
    children,
    ...rest
  } = props;

  const [locScale, setLocScale] = useState(new Vector3(1, 1, 1));

  const geo = useMemo(() => {
    const tolerance = 0.25; // 25% tolerance

    let closestBox: CachedBox | undefined = undefined;
    let closestOffset = Infinity;
    for (const box of local_cache) {
      const scale = box.width / width;
      const heightDiff = Math.abs(box.height - height * scale);
      const depthDiff = Math.abs(box.depth - depth * scale);
      if (
        heightDiff / box.height < tolerance &&
        depthDiff / box.depth < tolerance &&
        heightDiff + depthDiff < closestOffset
      ) {
        closestBox = box;
        closestOffset = heightDiff + depthDiff;
      }
    }

    const key =
      closestBox?.key ?? `geo_rounded_box_${width}x${height}x${depth}`;
    const w = closestBox?.width ?? width;
    const h = closestBox?.height ?? height;
    const d = closestBox?.depth ?? depth;
    const r = Math.min(w, h, d) / 2;

    const get_geo = () =>
      cache.getResource(
        key,
        () => new RoundedBoxGeometry(width, height, depth, 4, r)
      );

    // make sure to cache result if it's not already cached
    if (!closestBox) local_cache.push({ key, width, height, depth });

    setLocScale(new Vector3(width / w, height / h, depth / d));
    return get_geo();
  }, [width, height, depth]);

  return (
    <group name="spacesvr-rounded-box" {...rest}>
      <mesh scale={locScale} material={material} geometry={geo}>
        {children}
      </mesh>
    </group>
  );
}
