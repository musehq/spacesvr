import { Suspense, useMemo } from "react";
import { GroupProps } from "@react-three/fiber";
import { useModel } from "../../logic";
import { Box3, Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";
import { ErrorBoundary } from "react-error-boundary";

type ModelProps = {
  src: string;
  center?: boolean;
  normalize?: boolean;
} & GroupProps;

function UnsuspensedModel(props: ModelProps) {
  const { src, center, normalize, ...rest } = props;

  const gltf = useModel(src);
  const model = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);

  const bbox = useMemo(() => new Box3().setFromObject(model), [model]);
  const centerVec = useMemo(
    () => bbox.getCenter(new Vector3()).multiplyScalar(-1),
    [bbox]
  );

  const sizeX = bbox.max.x - bbox.min.x;
  const sizeY = bbox.max.y - bbox.min.y;
  const sizeZ = bbox.max.z - bbox.min.z;
  const maxSide = Math.max(sizeX, sizeY, sizeZ);
  const NORM_SCALE = 1 / maxSide;

  return (
    <group name="spacesvr-model" {...rest}>
      <group scale={normalize ? NORM_SCALE : 1}>
        <primitive object={model} position={center ? centerVec : undefined} />
      </group>
    </group>
  );
}

function FallbackModel(props: ModelProps) {
  const { src, center, normalize, ...rest } = props;

  return (
    <group name="spacesvr-fallback-model" {...rest}>
      <mesh>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="black" wireframe />
      </mesh>
    </group>
  );
}

export function Model(props: ModelProps) {
  return (
    <ErrorBoundary
      fallbackRender={() => <FallbackModel {...props} />}
      onError={(err) => console.error(err)}
    >
      <Suspense fallback={null}>
        <UnsuspensedModel {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
