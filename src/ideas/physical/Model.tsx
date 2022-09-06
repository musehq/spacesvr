import { Fragment, Suspense } from "react";
import { GroupProps } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { useModel } from "../../logic";

type ModelProps = {
  src: string;
  center?: boolean;
} & GroupProps;

function UnsuspensedModel(props: ModelProps) {
  const { src, center, ...rest } = props;
  const gltf = useModel(src);

  const Parent = center ? Center : Fragment;

  return (
    <group name="spacesvr-model" {...rest}>
      <Parent>
        <primitive object={gltf.scene} />
      </Parent>
    </group>
  );
}

export function Model(props: ModelProps) {
  return (
    <Suspense fallback={null}>
      <UnsuspensedModel {...props} />
    </Suspense>
  );
}
