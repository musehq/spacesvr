import { Html } from "@react-three/drei";
import { createPortal } from "react-three-fiber";
import { ReactNode } from "react";
import { useEnvironment } from "../core/contexts/environment";

type Props = {
  children: ReactNode;
};

const Overlay = (props: Props) => {
  const { children } = props;
  const { containerRef } = useEnvironment();

  return <Html>{createPortal(children, containerRef.current)}</Html>;
};

export default Overlay;
