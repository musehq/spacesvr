import { GroupProps, useFrame, useThree } from "react-three-fiber";
import { ReactNode, useRef } from "react";
import { Group } from "three";

type Props = {
  children: ReactNode;
} & GroupProps;

export const FacePlayer = (props: Props) => {
  const { children, ...restProps } = props;

  const { camera } = useThree();
  const group = useRef<Group>();

  useFrame(() => {
    if (group.current) {
      group.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={group} {...restProps}>
      {children}
    </group>
  );
};
