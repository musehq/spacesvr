import { universe } from "../../logic/universe";
import { NamedArrayTuple } from "@react-three/drei/helpers/ts-utils";
import { useMemo } from "react";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";

type CachedBox = {
  width: number;
  height: number;
  depth: number;
  key: keyof typeof universe;
};

const CACHED_BOXES: CachedBox[] = [
  {
    width: 1,
    height: 1,
    depth: 0.25,
    key: "geo_rounded_box_1x1",
  },
  {
    width: 1,
    height: 0.35,
    depth: 0.125,
    key: "geo_rounded_box_1x0_35",
  },
  {
    width: 1,
    height: 0.3,
    depth: 0.1,
    key: "geo_rounded_box_1x0_3",
  },
];

type RoundedBox = {
  args?: NamedArrayTuple<
    (width?: number, height?: number, depth?: number) => void
  >;
} & Omit<JSX.IntrinsicElements["mesh"], "args">;

export function RoundedBox(props: RoundedBox) {
  const {
    args: [width = 1, height = 1, depth = 0.25] = [],
    children,
    ...rest
  } = props;

  const geo = useMemo(() => {
    const tolerance = 0.25; // 15% tolerance

    let closestBox = undefined;
    let closestOffset = Infinity;
    for (const box of CACHED_BOXES) {
      const scale = width / box.width;
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

    if (closestBox) {
      return (universe[closestBox.key] as RoundedBoxGeometry)
        .clone()
        .scale(
          width / closestBox.width,
          height / closestBox.height,
          depth / closestBox.depth
        );
    }

    const radius = Math.min(width, height, depth) / 2;
    return new RoundedBoxGeometry(width, height, depth, 4, radius);
  }, [width, height, depth]);

  return (
    <group name="spacesvr-rounded-box">
      <mesh {...rest} geometry={geo}>
        {children}
      </mesh>
    </group>
  );
}
