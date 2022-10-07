import { Suspense } from "react";
import { Environment } from "@react-three/drei";

type HDRIProps = {
  src: string;
  disableBackground?: boolean;
  disableEnvironment?: boolean;
};

export function HDRI(props: HDRIProps) {
  const { src, disableBackground, disableEnvironment } = props;

  return (
    <Suspense fallback={null}>
      <Environment
        files={src}
        background={
          !disableBackground && !disableEnvironment
            ? true
            : disableEnvironment && !disableBackground
            ? "only"
            : false
        }
      />
    </Suspense>
  );
}
