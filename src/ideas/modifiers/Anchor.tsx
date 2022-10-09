import { ReactNode } from "react";
import { GroupProps, useThree } from "@react-three/fiber";
import { Interactable } from "./Interactable";

type AnchorProps = {
  href: string;
  target?: string;
  children: ReactNode | ReactNode[];
} & GroupProps;

export function Anchor(props: AnchorProps) {
  const { href, target = "_self", children, ...rest } = props;

  const gl = useThree((st) => st.gl);

  const onClick = () => {
    if (gl.xr.isPresenting) {
      gl.xr.getSession()?.end();
    }
    window.open(href, target);
  };

  return (
    <group name={`anchor-${href}`} {...rest}>
      <Interactable onClick={onClick}>{children}</Interactable>
    </group>
  );
}
